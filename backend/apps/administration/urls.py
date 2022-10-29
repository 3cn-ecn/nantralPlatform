from django.urls import path

from .views import ListAdministrationView
from apps.group.urls import make_group_url_patterns

app_name = 'administration'

urlpatterns = [
    path('', ListAdministrationView.as_view(), name='index'),
] + make_group_url_patterns()
