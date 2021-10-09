from django.conf.urls import url
from django.urls import path

from .api_views import *

app_name = 'academic'

urlpatterns = [
    path('OD', CourseODList.as_view(), name='od_list'),
    path('OP', CourseOPList.as_view(), name='op_list'),
    path('ITII', CourseITIIList.as_view(), name='itii_list'),
    path('MASTER', CourseMasterList.as_view(), name='master_list'),
    path('type', CourseTypeList.as_view(), name='type_list'),
    path('course-members', ListCourseMembersAPIView.as_view(),
         name='list-course-members')
]
