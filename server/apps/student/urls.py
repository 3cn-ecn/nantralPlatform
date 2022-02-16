from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'student'

urlpatterns = [
    path('<slug:pk>', StudentProfile.as_view(), name='detail'),
    path('<slug:pk>/edit', StudentProfileEdit.as_view(), name='update'),
    path('<slug:pk>/edit/password', change_password, name='change_pass'),
    path('', StudentList.as_view(), name='list')
]