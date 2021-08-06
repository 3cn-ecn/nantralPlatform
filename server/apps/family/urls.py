from django.urls import path

from .views import *
from apps.group.urls import makeGroupUrlpatterns


app_name = 'family'

urlpatterns = [
    path('', )
] + makeGroupUrlpatterns()