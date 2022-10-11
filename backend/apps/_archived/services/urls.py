from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'services'

urlpatterns = [
    path('signature/', SignatureGenerationView.as_view(), name='signature-gen'),
]
