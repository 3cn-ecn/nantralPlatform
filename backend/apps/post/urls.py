from django.urls import path

from .views import (
    PostDetailView,
    PostUpdateView,
    PostCreateView,
    PostDeleteView)

app_name = 'post'

urlpatterns = [
    path('create/group/<slug:group>/',
         PostCreateView.as_view(), name='create'),
    path('<slug:slug>/', PostDetailView.as_view(), name='detail'),
    path('<slug:slug>/edit/', PostUpdateView.as_view(), name='edit'),
    path('<slug:slug>/delete/', PostDeleteView.as_view(), name='delete'),
]
