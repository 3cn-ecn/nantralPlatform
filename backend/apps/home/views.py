from os.path import join
from urllib.parse import urlparse

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.http import FileResponse, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import resolve
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.views.generic import FormView

import requests
from django_vite.apps import DjangoViteAssetLoader
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.roommates.models import Roommates
from apps.student.models import Student
from apps.utils.github import create_issue

from .forms import SuggestionForm

# PAGES VIEWS


class SuggestionView(LoginRequiredMixin, FormView):
    template_name = "home/suggestions.html"
    form_class = SuggestionForm

    def form_valid(self, form):
        student_url = self.request.build_absolute_uri(
            self.request.user.student.get_absolute_url()
        )
        create_issue(
            title=form.cleaned_data["title"],
            label=form.cleaned_data["suggestion_or_bug"],
            body=(
                f"{form.cleaned_data['description']} <br/><br />"
                f"[Voir l'auteur sur Nantral Platform]({student_url})"
            ),
        )
        messages.success(
            self.request, "Votre suggestion a été enregistrée merci"
        )
        return redirect("home:home")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["ariane"] = [{"target": "#", "label": "Suggestions & Bugs"}]
        return context


@require_http_methods(["GET"])
def react_app_view(request):
    context = {"DJANGO_VITE_DEV_MODE": settings.DJANGO_VITE_DEV_MODE}
    response = render(request, "base_empty.html", context)
    return response


# SHORTCUT AND REDIRECT VIEWS


@require_http_methods(["GET"])
@login_required
def current_user_page_view(request):
    """A view to redirect the user to his own page"""
    student = get_object_or_404(Student, pk=request.user.student.pk)
    response = redirect(f"/student/{student.pk}")
    return response


@require_http_methods(["GET"])
@login_required
def current_user_roommates_view(request):
    """A view to redirect the user to his roommates page"""
    now = timezone.now()
    roommates = (
        Roommates.objects.filter(members=request.user.student)
        .filter(
            Q(
                Q(begin_date__lte=now)
                & (Q(end_date__gte=now) | Q(end_date=None))
            )
        )
        .first()
    )
    if roommates:
        return redirect("roommates:detail", roommates.slug)
    else:
        return redirect("roommates:housing-map")


# SPECIAL FILE VIEWS THAT HAVE TO BE SERVED FROM ROOT


@require_http_methods(["GET"])
def service_worker(request):
    """A view to serve the service worker"""
    vite_loader = DjangoViteAssetLoader.instance()
    service_worker_url = vite_loader.generate_vite_asset_url(
        "src/legacy/app/sw.ts"
    )
    if settings.DJANGO_VITE_DEV_MODE:
        response = requests.get(service_worker_url)
        return HttpResponse(
            response.content, content_type="application/javascript"
        )
    else:
        parsed_url = urlparse(service_worker_url)
        path_to_file = join(
            settings.STATIC_ROOT,
            parsed_url.path.replace(settings.STATIC_URL, "", 1),
        )
        return FileResponse(open(path_to_file, "rb"))


@require_http_methods(["GET"])
def assetlinks(request):
    """
    A view to serve the assetlinks file, for the PWA application on Play Store,
    to ensure to Google we own the website.
    """
    file_path = join(settings.BASE_DIR, "static/assetlinks.json")
    with open(file_path) as file:
        return HttpResponse(file.read())


# ERROR PAGES VIEWS


@require_http_methods(["GET"])
def offline_view(request):
    response = render(request, "home/offline.html")
    return response


# ERROR PAGES VIEWS


@require_http_methods(["GET", "POST", "PUT", "DELETE"])
def handler403(request, *args, **argv):
    response = render(request, "errors/403.html", context={}, status=403)
    return response


@require_http_methods(["GET", "POST", "PUT", "DELETE"])
def handler404(request, *args, **argv):
    response = render(request, "errors/404.html", context={}, status=404)
    return response


@require_http_methods(["GET", "POST", "PUT", "DELETE"])
def handler500(request, *args, **argv):
    response = render(request, "errors/500.html", context={}, status=500)
    return response


# API VIEWS


class DoIHaveToLoginView(APIView):
    """API endpoint to check if user has to login to see a page"""

    def get(self, request, format=None):
        path = request.GET.get("path")
        try:
            view, args, kwargs = resolve(path)
            kwargs["request"] = request
            kwargs["request"].path = path
            v = view(*args, **kwargs)
            have_to_login = v.url.split("?")[0] == settings.LOGIN_URL
            return Response(data=have_to_login)
        except Exception:
            return Response(data=False)
