from django.urls import path

from .admin_views import HomeAdminView, ResultsView

app_name = 'family-admin'

urlpatterns = [
    path('', HomeAdminView.as_view(), name='home'),
    path('results', ResultsView.as_view(), name='results')
]