from django.urls import path

from .views import *

# petite note : on n'utilise pas les urls des groupes ici
# afin de masquer les noms des familles dans les urls
# pour ne pas tout spoiler aux 1A

app_name = 'family'

urlpatterns = [
    path('', HomeFamilyView.as_view(), name='home'),
    path('liste-famille/join', ListFamilyJoinView.as_view(), name='family-list-join'),
    path('liste-famille', ListFamilyView.as_view(), name='family-list'),
    path('ajout-famille', CreateFamilyView.as_view(), name='create-family'),
    path('famille/<int:pk>', DetailFamilyView.as_view(), name='detail'),
    path('famille/<int:pk>/join', JoinFamilyView.as_view(), name='join'),
    path('famille/<int:pk>/edit', UpdateFamilyView.as_view(), name='update'),
    path('questionnaire/<int:id>', QuestionnaryPageView.as_view(), name='questionnary'),
    path('process/<str:redirection>', ProcessAlgorithm.as_view(), name='process'),
]