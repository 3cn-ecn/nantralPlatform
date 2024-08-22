from rest_framework.routers import DefaultRouter

from .api_views import StudentViewSet

app_name = "student"

# router for the API
router = DefaultRouter()
router.register("student", StudentViewSet, basename="student")

# urls
urlpatterns = router.urls
