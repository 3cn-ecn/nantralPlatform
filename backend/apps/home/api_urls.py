from django.urls import path

from .api_views import (
    CreateIssueView)

app_name = 'api_home'


# rooter for API: it creates all urls for a viewSet at once
# see https://www.django-rest-framework.org/api-guide/routers/#simplerouter

urlpatterns = [
    path('/suggestion/', CreateIssueView.as_view(), name='suggestion'),
]
