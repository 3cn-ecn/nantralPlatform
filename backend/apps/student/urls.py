from django.urls import path

from .views import (
    StudentProfileEdit,
    change_password,
)

app_name = "student"

urlpatterns = [
    path("<slug:pk>/edit/", StudentProfileEdit.as_view(), name="update"),
    path("<slug:pk>/edit/password/", change_password, name="change_pass"),
]
