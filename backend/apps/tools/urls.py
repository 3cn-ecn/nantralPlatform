from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'tools'

urlpatterns = [
    path('signature/', SignatureGenerationView.as_view(), name='signature-gen'),
]