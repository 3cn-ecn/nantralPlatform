from django.urls import path

from .views import redirect_to_club, redirect_to_list

app_name = "club"

urlpatterns = [
    path("", redirect_to_list, name="index"),
    path("<slug:slug>/", redirect_to_club, name="members"),
]
