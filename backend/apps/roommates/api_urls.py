from django.urls import path

from rest_framework.routers import DefaultRouter

from .api_views import (
    CheckAddressView,
    FlatShareMembershipViewSet,
    HousingView,
    RoommatesDetails,
    SearchGeocodingView,
)

app_name = "roommates_api"

router = DefaultRouter()
router.register("membership", FlatShareMembershipViewSet, basename="membership")

urlpatterns = [
    path("geocoding", SearchGeocodingView.as_view(), name="geocoding"),
    path("housing", HousingView.as_view(), name="housing"),
    path("housing/check", CheckAddressView.as_view(), name="address-check"),
    path(
        "roommates-details",
        RoommatesDetails.as_view(),
        name="roommates-details",
    ),
]
urlpatterns += router.urls
