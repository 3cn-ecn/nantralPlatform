from django.urls import path

from .views import SignatureGenerationView

app_name = 'services'

urlpatterns = [
    path('signature/', SignatureGenerationView.as_view(), name='signature-gen'),
]
