from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'home'

urlpatterns = [
    path('sugestions/', SuggestionView.as_view(), name='sugestions'),
    path('legal_mentions', LegalMentionsView.as_view(), name='mentions'),
    path('me/', currentUserPageView, name='me'),
    path('my_coloc/', currentUserRoommatesView, name='my_coloc'),
    path('', HomeView.as_view(), name='home'),
    path('404', handler404),
    path('403', handler403),
    path('413', handler413),
    path('500', handler500),
]
