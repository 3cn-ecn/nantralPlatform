from django import forms

from apps.notification.models import Subscription
from apps.utils.slug import get_object_from_full_slug


class SubscriptionForm(forms.Form):
    """Formulaire pour modifier l'abonnement d'un ensemble de pages."""

    def display_page(self, page):
        try:
            page_object = get_object_from_full_slug(page)
            name = page_object.name
            url = page_object.get_absolute_url()
            return f'{name} (<a href="{url}" target="_blank">voir la page</a>)'
        except Exception:
            return page

    def __init__(self, pages=[], initial=None, *args, **kwargs):
        super().__init__(initial=initial, *args, **kwargs)
        if initial is None:
            initial = {}
        for page in pages:
            self.fields[page] = forms.BooleanField(
                label=self.display_page(page),
                required=False
            )

    def save(self, student):
        if self.is_valid():
            for page, choice in self.cleaned_data.items():
                if not choice:
                    Subscription.objects.get(
                        page=page,
                        student=student
                    ).delete()
