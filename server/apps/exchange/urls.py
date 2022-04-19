from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'exchange'

urlpatterns = [
    path('', ExchangeView.as_view(), name='exchange'),
    path('add-exchange', AddExchangeView.as_view(), name='add-exchange'),
    path('<int:pk>/update-exchange', UpdateExchangeView.as_view(), name='update-exchange'),
    path('<int:pk>/delete-exchange', DeleteExchangeView.as_view(), name='delete-exchange')
]
