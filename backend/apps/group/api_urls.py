from rest_framework.routers import DefaultRouter

from .api_views import (
    GroupTypeViewSet,
    GroupViewSet,
    LabelViewSet,
    MapViewSet,
    MembershipViewSet,
    ThematicViewSet,
)

app_name = "api_group"


# rooter for API: it creates all urls for a viewSet at once
# see https://www.django-rest-framework.org/api-guide/routers/#simplerouter
router = DefaultRouter()
router.register("thematic", ThematicViewSet, basename="thematic")
router.register("membership", MembershipViewSet, basename="membership")
router.register("group", GroupViewSet, basename="group")
router.register("grouptype", GroupTypeViewSet, basename="grouptype")
router.register("label", LabelViewSet, basename="label")
router.register("map", MapViewSet, basename="map")
urlpatterns = router.urls
