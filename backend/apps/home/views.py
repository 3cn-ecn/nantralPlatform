from datetime import timedelta
from typing import List

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from django.contrib.sites.shortcuts import get_current_site
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_http_methods
from django.views.generic import TemplateView, FormView
from django.urls import reverse, resolve
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response

from apps.account.models import TemporaryAccessRequest
from apps.post.models import Post
from apps.roommates.models import Roommates
from apps.student.models import Student
from apps.utils.github import create_issue

from .forms import SuggestionForm


class HomeView(LoginRequiredMixin, TemplateView):
    template_name = 'home/home.html'

    def dispatch(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            temporary_access_request = TemporaryAccessRequest.objects.filter(
                user=self.request.user).first()
            if temporary_access_request:
                message = (
                    'Votre compte n\'est pas encore définitif. Veuillez le '
                    + f'valider <a href="{reverse("account:upgrade-permanent")}'
                    + '">ici</a>. Attention après le '
                    + f'{temporary_access_request.approved_until} vous ne '
                    + 'pourrez plus vous connecter si vous n\'avez pas '
                    + 'renseigné votre adresse Centrale.')
                messages.warning(request, message)
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        publication_date = timezone.make_aware(
            timezone.now().today() - timedelta(days=10))
        posts: List[Post] = (
            Post.objects
            .filter(publication_date__gte=publication_date)
            .order_by('-publication_date'))
        context['posts'] = [
            post for post in posts if post.can_view(self.request.user)]
        context['ariane'] = [
            {
                'target': '#',
                'label': 'Accueil'
            }
        ]
        return context


class SuggestionView(LoginRequiredMixin, FormView):
    template_name = 'home/suggestions.html'
    form_class = SuggestionForm

    def form_valid(self, form):
        create_issue(
            title=form.cleaned_data['title'],
            label=form.cleaned_data['suggestion_or_bug'],
            body=(
                f"{form.cleaned_data['description']} <br/> "
                "[Clique pour découvrir qui propose ça.]"
                f"(https://{get_current_site(self.request)}"
                f"{self.request.user.student.get_absolute_url()})"),
        )
        messages.success(
            self.request, "Votre suggestion a été enregistrée merci")
        return redirect('home:home')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': '#',
                'label': "Suggestions & Bugs"
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


@require_http_methods(["GET"])
@login_required
def current_user_page_view(request):
    """A view to redirect the user to his own page"""
    student = get_object_or_404(Student, pk=request.user.student.pk)
    response = redirect('student:detail', student.pk)
    return response


@require_http_methods(["GET"])
@login_required
def current_user_roommates_view(request):
    """A view to redirect the user to his roommates page"""
    now = timezone.now()
    roommates = (
        Roommates
        .objects
        .filter(members=request.user.student)
        .filter(Q(
            Q(begin_date__lte=now) & (Q(end_date__gte=now) | Q(end_date=None))
        ))
        .first())
    if roommates:
        return redirect('roommates:detail', roommates.slug)
    else:
        return redirect('roommates:housing-map')


@require_http_methods(["GET"])
def service_worker(request):
    """A view to serve the service worker"""
    sw_path = settings.BASE_DIR + "/static/js/app/sw.js"
    file = open(sw_path)
    response = HttpResponse(file.read(), content_type='application/javascript')
    file.close()
    return response


@require_http_methods(["GET"])
def offline_view(request):
    response = render(request, 'home/offline.html')
    return response


# ERROR PAGES VIEWS

@require_http_methods(["GET", "POST", "PUT", "DELETE"])
def handler403(request, *args, **argv):
    response = render(request, 'errors/403.html', context={}, status=403)
    return response


@require_http_methods(["GET", "POST", "PUT", "DELETE"])
def handler404(request, *args, **argv):
    response = render(request, 'errors/404.html', context={}, status=404)
    return response


@require_http_methods(["GET", "POST", "PUT", "DELETE"])
def handler413(request, *args, **argv):
    response = render(request, 'errors/413.html', context={}, status=404)
    return response


@require_http_methods(["GET", "POST", "PUT", "DELETE"])
def handler500(request, *args, **argv):
    response = render(request, 'errors/500.html', context={}, status=500)
    return response


# API VIEWS

class DoIHaveToLoginView(APIView):
    """API endpoint to check if user has to login to see a page"""

    def get(self, request, format=None):
        path = request.GET.get("path")
        try:
            view, args, kwargs = resolve(path)
            kwargs['request'] = request
            kwargs['request'].path = path
            v = view(*args, **kwargs)
            have_to_login = (v.url.split('?')[0] == settings.LOGIN_URL)
            return Response(data=have_to_login)
        except Exception:
            return Response(data=False)
