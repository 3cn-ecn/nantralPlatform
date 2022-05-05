from django.urls import path

from .views import *


app_name = 'post'

urlpatterns = [
    path('<slug:post_slug>/edit/', PostUpdateView.as_view(), name='edit'),
    path('event/<slug:post_slug>/', PostDetailView.as_view(), name='detail'),
]
