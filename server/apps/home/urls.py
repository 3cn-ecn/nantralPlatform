from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'home'

urlpatterns = [
    url('sugestions/', SuggestionView.as_view(), name='sugestions'),
    path('', HomeView.as_view(), name='home'),
]
