from django.urls import path

from . import views

app_name = 'tools'

urlpatterns = [
    path(
        'signature/',
        views.SignatureGenerationView.as_view(),
        name='signature-gen'),
]
