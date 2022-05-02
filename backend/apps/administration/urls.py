from django.urls import path

from .views import ListAdministrationView
from apps.group.urls import makeGroupUrlpatterns

app_name = 'administration'

urlpatterns = [
    path('', ListAdministrationView.as_view(), name='index'),
] + makeGroupUrlpatterns()