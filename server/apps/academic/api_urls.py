from django.conf.urls import url
from django.urls import path

from .api_views import *

app_name = 'academic'

urlpatterns = [
    path('od', CourseODList.as_view(), name='od_list')
]