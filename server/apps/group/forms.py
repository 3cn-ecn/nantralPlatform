from django.forms import ModelForm
from .models import AdminRightsRequest


class AdminRightsRequestForm(ModelForm):
    class Meta:
        model = AdminRightsRequest
        fields = ['reason']
