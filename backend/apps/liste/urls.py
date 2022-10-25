from django.urls import path

from .views import ListListeView
from apps.group.urls import make_group_url_patterns

app_name = 'liste'

urlpatterns = [
    path('', ListListeView.as_view(), name='index'),
    path('liste/', ListListeView.as_view(), name='liste-list'),
] + make_group_url_patterns()
