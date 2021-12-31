from datetime import timedelta
from typing import List

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from django.contrib.sites.shortcuts import get_current_site
from django.db.models import Q
from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import TemplateView, FormView
from django.urls import reverse
from django.utils import timezone

from apps.post.models import Post
from apps.student.models import Student
from apps.roommates.models import Roommates
from apps.utils.github import create_issue
from apps.account.models import TemporaryAccessRequest

from .forms import SuggestionForm


class HomeView(LoginRequiredMixin, TemplateView):
    template_name = 'home/home.html'

    def dispatch(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            temporaryAccessRequest = TemporaryAccessRequest.objects.filter(
                user=self.request.user).first()
            if temporaryAccessRequest:
                message = f'Votre compte n\'est pas encore définitif.\
                    Veuillez le valider <a href="{reverse("account:upgrade-permanent")}">ici</a>.\
                    Attention après le {temporaryAccessRequest.approved_until}\
                    vous ne pourrez plus vous connecter si vous n\'avez pas renseigné votre adresse Centrale.'
                messages.warning(request, message)
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        publication_date = timezone.make_aware(timezone.now().today()-timedelta(days=10))
        posts: List[Post] = Post.objects.filter(
            publication_date__gte=publication_date).order_by('-publication_date')
        context['posts'] = [
            post for post in posts if post.can_view(self.request.user)]
        return context


class SuggestionView(LoginRequiredMixin, FormView):
    template_name = 'home/suggestions.html'
    form_class = SuggestionForm

    def form_valid(self, form):
        create_issue(
            title=form.cleaned_data['title'],
            body=f"{form.cleaned_data['description']} <br/> [Clique pour découvrir qui propose ça.](http://{get_current_site(self.request)}{self.request.user.student.get_absolute_url()})",
            label=form.cleaned_data['suggestionOrBug']
        )
        messages.success(
            self.request, 'Votre suggestion a été enregistrée merci')
        return redirect('home:home')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': '#', 
                'label': 'Suggestions & Bugs'
            }
        ]
        return context

class LegalMentionsView(TemplateView):
    template_name = 'home/mentions.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': '#', 
                'label': 'Mentions Légales'
            }
        ]
        return context

@login_required
def currentUserPageView(request):
    """A view to redirect the user to his own page"""
    student = get_object_or_404(Student, pk=request.user.student.pk)
    response = redirect('student:detail', student.pk)
    return response

@login_required
def currentUserRoommatesView(request):
    """A view to redirect the user to his roommates page"""
    now = timezone.now()
    roommates = Roommates.objects.filter(
            members=request.user.student
        ).filter(
            Q(
                Q(begin_date__lte=now) & 
                (
                    Q(end_date__gte=now) | Q(end_date=None)
                )
            )
        ).first()
    if roommates:
        return redirect('roommates:detail', roommates.slug)
    else:
        return redirect('roommates:housing-map')




def service_worker(request):
    """A view to serve the service worker"""
    sw_path = settings.BASE_DIR + "/static/app/sw.js"
    file = open(sw_path)
    response = HttpResponse(file.read(), content_type='application/javascript')
    file.close()
    return response


# ERROR PAGES VIEWS

def handler403(request, *args, **argv):
    response = render(request, 'errors/403.html', context={}, status=403)
    return response

def handler404(request, *args, **argv):
    response = render(request, 'errors/404.html', context={}, status=404)
    return response

def handler413(request, *args, **argv):
    response = render(request, 'errors/413.html', context={}, status=404)
    return response

def handler500(request, *args, **argv):
    response = render(request, 'errors/500.html', context={}, status=500)
    return response
