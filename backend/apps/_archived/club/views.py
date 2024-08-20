from django.shortcuts import redirect
from django.views.decorators.http import require_GET


@require_GET
def redirect_to_list(request):
    return redirect("/group/?type=club")


@require_GET
def redirect_to_club(request, slug):
    return redirect(f"/group/@{slug}")
