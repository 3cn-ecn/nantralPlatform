from os.path import join
from urllib.parse import urlparse

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import FileResponse, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.views.decorators.http import require_http_methods

import requests
from django_vite.apps import DjangoViteAssetLoader

from apps.account.models import User
from apps.group.models import Group, GroupType

# FRONTEND section


@require_http_methods(["GET"])
def react_app_view(request):
    """Serve the React frontend app."""
    context = {
        "DJANGO_VITE_DEV_MODE": settings.DJANGO_VITE_DEV_MODE,
        "MAPBOX_API_KEY": settings.MAPBOX_API_KEY,
    }
    response = render(request, "base_empty.html", context)
    return response


# SHORTCUTS section


@require_http_methods(["GET"])
@login_required
def current_user_page_view(request):
    """Shortcut to the current user profile (/me)"""
    user = get_object_or_404(User, pk=request.user.pk)
    response = redirect(user.get_absolute_url())
    return response


@require_http_methods(["GET"])
@login_required
def current_user_roommates_view(request):
    """Shortcut to the current user roommates instance (/my_coloc)"""
    now = timezone.now()
    roommates = (
        Group.objects.filter(
            members=request.user, type=GroupType.objects.get(slug="colocs")
        )
        .filter(
            Q(
                Q(begin_date__lte=now)
                & (Q(end_date__gte=now) | Q(end_date=None)),
            ),
        )
        .first()
    )
    if roommates:
        return redirect(f"/group/@{roommates.slug}/")
    else:
        return redirect("/map/?type=colocs")


@require_http_methods(["GET"])
def service_worker(request):
    """
    Shortcut to the service worker file (the service worker must be served
    from the root path to be able to intercept all the requests of the app)
    """
    vite_loader = DjangoViteAssetLoader.instance()
    service_worker_url = vite_loader.generate_vite_asset_url(
        "src/legacy/app/sw.ts",
    )
    if settings.DJANGO_VITE_DEV_MODE:
        response = requests.get(service_worker_url)  # noqa: S113 (dev only)
        return HttpResponse(
            response.content,
            content_type="application/javascript",
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
    Shortcut to the assetlinks file, for the PWA application on Play Store,
    to ensure to Google we own the website.
    """
    file_path = join(settings.BASE_DIR, "static/assetlinks.json")
    with open(file_path) as file:
        return HttpResponse(file.read())


# ERROR PAGES section


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
