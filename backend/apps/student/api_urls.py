from django.urls import path

from rest_framework.routers import DefaultRouter

from .api_views import StudentListView, StudentViewSet

app_name = "student"

# router for the API
router = DefaultRouter()
router.register("student", StudentViewSet, basename="student")

# urls
urlpatterns = [
    path("", StudentListView.as_view(), name="list"),
    *router.urls,
]
