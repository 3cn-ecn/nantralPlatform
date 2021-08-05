from django.urls import path

from .views import ListListeView
from apps.group.urls import makeGroupUrlpatterns

app_name = 'liste'

urlpatterns = [
    path('', ListListeView.as_view(), name='index'),
    path('liste', ListListeView.as_view(), name='liste-list'),
] + makeGroupUrlpatterns("liste")