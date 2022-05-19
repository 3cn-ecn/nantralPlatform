from django.urls import path

from .views import HomeFamilyView, ListFamilyJoinView, ListFamilyView, CreateFamilyView, DetailFamilyView, JoinFamilyView, UpdateFamilyView, QuestionnaryPageView, ItiiQuestionFamilyView

# petite note : on n'utilise pas les urls des groupes ici
# afin de masquer les noms des familles dans les urls
# pour ne pas tout spoiler aux 1A

app_name = 'family'

urlpatterns = [
    path('', HomeFamilyView.as_view(), name='home'),
    path('liste-famille/join/', ListFamilyJoinView.as_view(), name='family-list-join'),
    path('liste-famille/', ListFamilyView.as_view(), name='family-list'),
    path('ajout-famille/', CreateFamilyView.as_view(), name='create-family'),
    path('famille/<int:pk>/', DetailFamilyView.as_view(), name='detail'),
    path('famille/<int:pk>/join/', JoinFamilyView.as_view(), name='join'),
    path('famille/<int:pk>/edit/', UpdateFamilyView.as_view(), name='update'),
    path('famille/<int:pk>/question-itii/', ItiiQuestionFamilyView.as_view(), name='itii-question'),
    path('questionnaire/<int:id>/', QuestionnaryPageView.as_view(), name='questionnary'),
]