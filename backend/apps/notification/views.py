from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages

from .models import Subscription
from .forms import SubscriptionForm


class SettingsView(LoginRequiredMixin, TemplateView):
    """Define the view for the notifications settings page."""

    template_name = "notification/settings.html"

    def get_pages(self):
        student = self.request.user.student
        listOfSub = Subscription.objects.filter(student=student).values('page')
        pages = [s['page'] for s in listOfSub]
        return pages

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': '#',
                'label': 'Notifications'
            }
        ]
        pages = self.get_pages()
        initial = {p: True for p in pages}
        context['form'] = SubscriptionForm(pages=pages, initial=initial)
        return context

    def post(self, request, *args, **kwargs):
        pages = self.get_pages()
        form = SubscriptionForm(pages=pages, data=request.POST)
        if form.is_valid():
            form.save(student=request.user.student)
            messages.success(request, "Vos choix ont bien été enregistrés !")
            new_pages = self.get_pages()
            form = SubscriptionForm(new_pages, request.POST)
        else:
            messages.error(request, "Oups, une erreur c'est produite !")
        context = {'form': form}
        return self.render_to_response(context)
