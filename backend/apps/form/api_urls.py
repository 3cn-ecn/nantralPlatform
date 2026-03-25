from rest_framework.routers import DefaultRouter

from .api_views import FormAnswerViewSet, FormSchemaViewSet

app_name = "form"

router = DefaultRouter()
router.register("schema", FormSchemaViewSet, basename="form-schema")
router.register("schema/(?P<schema>[^/.]+)/answer", FormAnswerViewSet, basename="form-answer")

urlpatterns = router.urls
