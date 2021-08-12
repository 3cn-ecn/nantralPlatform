from django.urls import path

from .views import *

# petite note : on n'utilise pas les urls des groupes ici
# afin de masquer les noms des familles dans les urls
# pour ne pas tout spoiler aux 1A

app_name = 'family'

urlpatterns = [
    path('', HomeFamilyView.as_view(), name='home'),
    path('liste-famille', ListFamilyView.as_view(), name='family-list'),
    path('create-family', CreateFamilyView.as_view(), name='create-family'),
    path('questionnaire/<int:id>', QuestionnaryPageView.as_view(), name='questionnary'),
    path('famille/<int:pk>', DetailFamilyView.as_view(), name='detail'),
    path('famille/<int:pk>/edit', UpdateFamilyView.as_view(), name='update'),
]