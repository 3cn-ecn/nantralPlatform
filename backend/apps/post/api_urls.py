# from django.urls import path
from rest_framework.routers import DefaultRouter

from .api_views import (
    PostViewSet
)

app_name = "post"
router = DefaultRouter()
router.register('', PostViewSet, basename='event')
"""
urlpatterns = [
    path('', ListPostsAPIView.as_view({'get': 'list'}), name='list-all-posts'),
    path('<slug:post_slug>', UpdatePostAPIView.as_view(), name='update-post'),
    path('group/<slug:group>', ListPostsGroupAPIView.as_view(),
         name='list-group-posts'),
]
"""
urlpatterns = router.urls
