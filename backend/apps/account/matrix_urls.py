from django.urls.conf import path

from .matrix_views import CheckCredentials

app_name = "matrix_api"

urlpatterns = [
    path("_matrix-internal/identity/v1/check_credentials/", CheckCredentials.as_view(), name="check_credentials"),
]