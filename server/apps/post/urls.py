from django.urls import path

from .views import *


app_name = 'post'

urlpatterns = [
    path('<slug:post_slug>/edit/', PostDetailView.as_view(), name='edit'),
    path('event/<slug:post_slug>/', PostUpdateView.as_view(), name='detail'),
]
