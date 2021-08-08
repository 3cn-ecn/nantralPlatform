from django.urls import path

from .views import *
#from apps.group.urls import makeGroupUrlpatterns


app_name = 'family'

urlpatterns = [
    path('', HomeFamilyView.as_view(), name='home'),
    path('liste-famille', ListFamilyView.as_view(), name='family-list'),
    path('create-family', CreateFamilyView.as_view(), name='create-family'),
    path('questionnaire', QuestionnaryView.as_view(), name='questionnary'),
    path('famille/<slug:slug>', DetailFamilyView.as_view(), name='detail'),
]