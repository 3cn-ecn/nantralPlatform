from django.contrib.auth import login, logout
from django.contrib.auth.views import PasswordResetConfirmView
from django.contrib.auth.forms import SetPasswordForm
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.contrib.sites.shortcuts import get_current_site
from django.views.generic.edit import FormView
from django.views.generic.base import TemplateView
from .forms import SignUpForm, LoginForm, ForgottenPassForm, ResetPassForm
from .tokens import account_activation_token
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_text
from django.views import View
from django.urls import reverse, reverse_lazy
from urllib import parse
from .emailAuthBackend import EmailBackend
from apps.student.models import Student
from django.contrib import messages
from django.core.mail import send_mail


class RegistrationView(FormView):
    template_name = 'account/registration.html'
    form_class = SignUpForm

    def form_valid(self, form):
        user = form.save()
        user.student.promo = form.cleaned_data.get('promo')
        user.student.last_name = form.cleaned_data.get('last_name').lower()
        user.student.first_name = form.cleaned_data.get('first_name').lower()
        user.student.email = form.cleaned_data.get('email')
        user.student.faculty = form.cleaned_data.get('faculty')
        user.student.path = form.cleaned_data.get('path')
        #create a unique user name
        first_name = ''.join(e.lower() for e in form.cleaned_data.get('first_name') if e.isalnum())
        last_name = ''.join(e.lower() for e in form.cleaned_data.get('last_name') if e.isalnum())
        promo = form.cleaned_data.get('promo')
        user.username = f'{first_name}.{last_name}{promo}-{user.id}'
        # user can't login until link confirmed
        user.is_active = False
        user.save()
        subject = 'Activation de votre compte Nantral Platform'
        current_site = get_current_site(self.request)
        # load a template like get_template() 
        # and calls its render() method immediately.
        message = render_to_string('account/activation_request.html', {
            'user': user,
            'domain': current_site.domain,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            # method will generate a hash value with user related data
            'token': account_activation_token.make_token(user),
        })
        user.email_user(subject, message, 'registration@nantral-platform.fr', html_message=message)
        messages.success(self.request, 'Un mail vous a été envoyé pour confirmer votre mail ECN.')
        return redirect(reverse('home:home'))


class ConfirmUser(View):
    def get(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        # checking if the user exists, if the token is valid.
        if user is not None and account_activation_token.check_token(user, token):
            # if valid set active true 
            user.is_active = True
            user.save()
            login(self.request, user, backend='apps.account.emailAuthBackend.EmailBackend')
            messages.success(request, 'Votre compte est desormais actif !')
            return redirect(reverse('home:home'))
        else:
            return render(self.request, 'account/activation_invalid.html')

class AuthView(FormView):
    template_name='account/login.html'
    form_class= LoginForm
    def get(self, request):
        if request.user.is_authenticated:
            user = request.user
            message = f'Vous etes déjà connecté en tant que {user.first_name}.'
            messages.warning(request, message)
            return redirect(reverse('home:home'))
        else:
            return super(AuthView, AuthView).get(self, request)
    def form_invalid(self, form):
        message = f'Veuillez vous connecter avec votre adresse mail ECN.'
        messages.warning(self.request, message)
        return redirect(reverse('account:login'))

    def form_valid(self, form):
        username = form.cleaned_data['email']
        password = form.cleaned_data['password']
        user = EmailBackend.authenticate(username=username, password=password)
        if user is not None:
            login(self.request, user, backend='apps.account.emailAuthBackend.EmailBackend')
            message = f'Bonjour {user.first_name} !'
            messages.success(self.request, message)
            return redirect(reverse('home:home'))
        else:
            messages.error(self.request, 'Identifiant inconnu ou mot de passe invalide.')
            return redirect(reverse('account:login'))


class LogoutView(View):
    def get(self, request):
        logout(request)
        messages.success(request, 'Vous avez été déconnecté.')
        return redirect(reverse('account:login'))

class ForgottenPassView(FormView):
    form_class = ForgottenPassForm
    template_name = 'account/forgotten_pass.html'
    def form_valid(self, form):
        user = User.objects.get(email=form.cleaned_data['email'])
        if user is not None:
            subject = '[Nantral Platform] Reinitialisation de votre mot de passe'
            current_site = get_current_site(self.request)
            message = render_to_string('account/password_request.html', {
                'user': user,
                'domain': current_site.domain,
                'uidb64': urlsafe_base64_encode(force_bytes(user.pk)),
                # method will generate a hash value with user related data
                'token': account_activation_token.make_token(user),
            })
            user.email_user(subject, message, 'accounts@nantral-platform.fr', html_message=message)
        messages.success(self.request, 'Un email de récuperation a été envoyé si cette adresse existe.')
        return redirect(reverse('account:login'))

class PasswordResetConfirmCustomView(PasswordResetConfirmView):
    template_name = 'account/reset_password.html'
    post_reset_login = True
    post_reset_login_backend = 'apps.account.emailAuthBackend.EmailBackend'
    form_class = SetPasswordForm
    token_generator = account_activation_token
    success_url = reverse_lazy('home:home')

def redirect_to_student(request, user_id):
    user = User.objects.get(id=user_id)
    student  = Student.objects.get(user=user)
    return redirect('student:update', student.pk)