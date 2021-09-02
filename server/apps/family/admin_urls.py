from django.urls import path

from .admin_views import HomeAdminView, ResultsDeltasView, ResultsSavedView, ResultsView

app_name = 'family-admin'

urlpatterns = [
    path('', HomeAdminView.as_view(), name='home'),
    path('results', ResultsView.as_view(), name='results'),
    path('results_deltas', ResultsDeltasView.as_view(), name='results-deltas'),
    path('results_saved', ResultsSavedView.as_view(), name='results-saved'),
]