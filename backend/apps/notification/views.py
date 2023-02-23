from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin


class SettingsView(LoginRequiredMixin, TemplateView):
    """Define the view for the notifications settings page."""

    template_name = "notification/settings.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': '#',
                'label': 'Notifications'
            }
        ]
        return context
