from django.urls import path

from .admin_views import HomeAdminView, ResultsDeltasView, ResultsSavedView, ResultsView, ResultsItiiView

app_name = 'family-admin'

urlpatterns = [
    path('', HomeAdminView.as_view(), name='home'),
    path('results', ResultsView.as_view(), name='results'),
    path('results_deltas', ResultsDeltasView.as_view(), name='results-deltas'),
    path('results_itii', ResultsItiiView.as_view(), name='results-itii'),
    path('results_saved', ResultsSavedView.as_view(), name='results-saved'),
]