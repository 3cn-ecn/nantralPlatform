from django.urls import path

from . import views

app_name = 'recherche'
urlpatterns = [
    path("", views.search_bar, name = 'index'),
    path("truc/", views.camarche, name = 'test')
]