from django.views.generic import FormView, View, TemplateView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin

# Create your views here.
from apps.utils.slug import SLUG_GROUPS, get_model
from .models import Subscription


class SettingsView(LoginRequiredMixin, TemplateView):
    template_name = "notification/settings.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        student = self.request.user.student
        context['ariane'] = [
            {
                'target': '#',
                'label': 'Notifications'
            }
        ]
        context['form'] = []
        for app in SLUG_GROUPS.keys():
            GroupModel = get_model(app)
            liste = []
            for group in GroupModel.objects.all():
                liste.append({
                    'name': group.name,
                    'slug': group.full_slug,
                    'subscribed': Subscription.hasSubscribed(group.full_slug, student)
                })
            context['form'].append({
                'app': GroupModel.app,
                'liste': liste
            })
        return context