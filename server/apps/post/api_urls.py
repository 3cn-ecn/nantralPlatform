from django.urls import path

from .api_views import ListPostsGroupAPIView, UpdatePostAPIView

app_name = "post"

urlpatterns = [
    path('<slug:post_slug>', UpdatePostAPIView.as_view(), name='update-post'),
    path('group/<slug:group>/', ListPostsGroupAPIView.as_view(),
         name='list-group-posts'),
]
