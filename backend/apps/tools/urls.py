from django.urls import path

from . import views

app_name = "tools"

urlpatterns = [
    path(
        "signature/old",
        views.SignatureGenerationView.as_view(),
        name="signature-gen",
    ),
]
