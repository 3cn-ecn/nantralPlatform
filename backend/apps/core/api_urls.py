from django.urls import path

from .api_views import CreateFeedbackView

app_name = "api_core"


urlpatterns = [
    path("feedback/", CreateFeedbackView.as_view(), name="feedback"),
]
