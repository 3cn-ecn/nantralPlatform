from datetime import date
from typing import Any, Dict, Union
from django.conf import settings
from django.contrib.auth import login, logout
from django.contrib.sites.shortcuts import get_current_site
from django.http.response import HttpResponse
from django.views.generic.edit import FormView
from django.shortcuts import get_object_or_404

from apps.utils.accessMixins import UserIsSuperAdmin
from .forms import SignUpForm, LoginForm, ForgottenPassForm, TemporaryRequestSignUpForm, UpgradePermanentAccountForm
from .tokens import account_activation_token
from django.contrib import messages
from django.shortcuts import render, redirect
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_text
from django.urls import reverse, reverse_lazy

from django.contrib.auth.views import PasswordResetConfirmView
from django.views import View

from django.contrib.auth.forms import SetPasswordForm
from django.contrib.auth.mixins import LoginRequiredMixin

from django.contrib.auth.models import User
from apps.student.models import Student

from .emailAuthBackend import EmailBackend
from .models import TemporaryAccessRequest
from .utils import user_creation, send_email_confirmation


class RegistrationView(FormView):
    template_name = 'account/registration.html'
    form_class = SignUpForm

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['temporary_registration'] = settings.TEMPORARY_ACCOUNTS_DATE_LIMIT >= date.today()
        return context

    def form_valid(self, form):
        user_creation(form, self.request)
        return redirect(reverse('home:home'))


class TemporaryRegistrationView(FormView):
    form_class = TemporaryRequestSignUpForm
    template_name = 'account/temporary_registration.html'

    def dispatch(self, request, *args: Any, **kwargs: Any):
        """Do not allow to use this view outside of allowed temporary accounts windows."""
        if not settings.TEMPORARY_ACCOUNTS_DATE_LIMIT >= date.today():
            return redirect(reverse('account:registration'))
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['DEADLINE_TEMPORARY_REGISTRATION'] = settings.TEMPORARY_ACCOUNTS_DATE_LIMIT
        return context

    def form_valid(self, form) -> HttpResponse:
        user_creation(form, self.request)
        return redirect(reverse('home:home'))


class ConfirmUser(View):
    def get(self, request, uidb64, token):
        tempAccessReq: Union[TemporaryAccessRequest, None] = None
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        # checking if the user is not a temporary one
        try:
            tempAccessReq: TemporaryAccessRequest = TemporaryAccessRequest.objects.get(
                user=user.id)
            if not tempAccessReq.approved:
                return render(self.request, 'account/activation_invalid.html')
        except TemporaryAccessRequest.DoesNotExist:
            pass
        # checking if the user exists, if the token is valid.
        if user is not None and account_activation_token.check_token(user, token):
            # if valid set active true
            user.is_active = True
            if tempAccessReq is not None:
                user.email = tempAccessReq.final_email
                tempAccessReq.delete()
                messages.warning(
                    request, f'Dorénavant vous devez utiliser {user.email} pour vous connecter.')
            user.save()
            login(self.request, user,
                  backend='apps.account.emailAuthBackend.EmailBackend')
            messages.success(request, 'Votre compte est desormais actif !')
            return redirect(reverse('home:home'))
        else:
            return render(self.request, 'account/activation_invalid.html')


class AuthView(FormView):
    template_name = 'account/login.html'
    form_class = LoginForm

    def get(self, request):
        if request.user.is_authenticated:
            user = request.user
            message = f'Vous etes déjà connecté en tant que {user.first_name.title()}.'
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
            if user.is_active:
                message = f'Bonjour {user.first_name.title()} !'
                messages.success(self.request, message)
            else:
                if settings.TEMPORARY_ACCOUNTS_DATE_LIMIT >= date.today():
                    # During certain periods allow temporary accounts.
                    try:
                        temporaryAccessRequest: TemporaryAccessRequest = TemporaryAccessRequest.objects.get(
                            user=user
                        )
                        if not temporaryAccessRequest.mail_valid:
                            message = 'Votre compte n\'est pas encore actif.\
                            Veuillez cliquer sur le lien envoyé par mail pour l\'\
                                activer.'
                            messages.error(self.request, message)
                            return redirect(reverse('account:login'))
                        if temporaryAccessRequest.approved_until <= date.today():
                            message = 'Votre compte n\'a pas encore été approuvé.\
                                On vous prévient par mail dès que c\'est le cas.'
                            messages.error(self.request, message)
                            return redirect(reverse('account:login'))
                        message = f'Votre compte n\'est pas encore définitif.\
                            Veuillez le valider <a href="{reverse("account:upgrade-permanent")}">ici</a>.\
                            Attention après le {temporaryAccessRequest.approved_until}\
                            vous ne pourrez plus vous connecter si vous n\'avez pas renseigné votre adresse Centrale.'
                        messages.warning(self.request, message)
                    except TemporaryAccessRequest.DoesNotExist:
                        messages.error(
                            self.request, 'Identifiant inconnu ou mot de passe invalide.')
                        return redirect(reverse('account:login'))
            login(self.request, user,
                  backend='apps.account.emailAuthBackend.EmailBackend')
            return redirect(reverse('home:home'))
        else:
            messages.error(
                self.request, 'Identifiant inconnu ou mot de passe invalide.')
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
            message = render_to_string('account/mail/password_request.html', {
                'user': user,
                'domain': current_site.domain,
                'uidb64': urlsafe_base64_encode(force_bytes(user.pk)),
                # method will generate a hash value with user related data
                'token': account_activation_token.make_token(user),
            })
            user.email_user(
                subject, message, 'accounts@nantral-platform.fr', html_message=message)
        messages.success(
            self.request, 'Un email de récuperation a été envoyé si cette adresse existe.')
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
    student = Student.objects.get(user=user)
    return redirect('student:update', student.pk)


class ABCApprovalTemporaryResgistrationView(UserIsSuperAdmin, View):
    def get(self, request, id):
        self.temp_req: TemporaryAccessRequest = get_object_or_404(
            TemporaryAccessRequest, id=id)

        if self.temp_req.approved:
            messages.warning(request, f'Cette requête a déjà été approuvée.')
            return redirect(reverse('home:home'))


class ApproveTemporaryRegistrationView(ABCApprovalTemporaryResgistrationView):
    def get(self, request, id):
        super().get(request, id)
        self.temp_req.approve()
        messages.success(
            request, f'Vous avez accepté la demande de {self.temp_req.user.first_name} {self.temp_req.user.last_name}')
        return redirect(reverse('home:home'))


class DenyTemporaryRegistrationView(ABCApprovalTemporaryResgistrationView):
    def get(self, request, id):
        super().get(request, id)
        messages.success(
            request, f'Vous avez refusé la demande de {self.temp_req.user.first_name} {self.temp_req.user.last_name}')
        self.temp_req.deny()
        return redirect(reverse('home:home'))


class ConfirmUserTemporary(View):
    def get(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        # checking if the user exists, if the token is valid.
        if user is not None and account_activation_token.check_token(user, token):
            try:
                temp_req: TemporaryAccessRequest = TemporaryAccessRequest.objects.get(
                    user=user)
                temp_req.mail_valid = True
                temp_req.save()
            except TemporaryAccessRequest.DoesNotExist:
                return render(self.request, 'account/activation_invalid.html')
            messages.success(request, 'Votre addresse mail est confirmé! \n\
            Comme vous n\'avez pas utilisé votre adresse Centrale, vous devez encore attendre qu\'un administrateur vérifie votre inscription.\n\
            On vous prévient par mail dès que c\'est bon!. ')
            return redirect(reverse('home:home'))
        else:
            return render(self.request, 'account/activation_invalid.html')


class PermanentAccountUpgradeView(LoginRequiredMixin, FormView):
    form_class = UpgradePermanentAccountForm
    template_name = 'account/permanent_account_upgrade.html'
    success_url = reverse_lazy('home:home')

    def get(self, request):
        get_object_or_404(
            TemporaryAccessRequest,
            user=self.request.user
        )
        return super().get(request)

    def form_valid(self, form: UpgradePermanentAccountForm) -> HttpResponse:
        temp_request = get_object_or_404(
            TemporaryAccessRequest,
            user=self.request.user
        )
        temp_request.final_email = form.cleaned_data['email']
        temp_request.save()
        send_email_confirmation(
            self.request.user, self.request, send_to=form.cleaned_data['email'])
        return super().form_valid(form)
