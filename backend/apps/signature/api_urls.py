from django.urls import path

from .api_views import SignatureApiView

app_name = "signature"

# urls
urlpatterns = [
    path("", SignatureApiView.as_view(), name="signature"),
]
