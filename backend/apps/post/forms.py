from django import forms
from django.forms import modelformset_factory

from .models import Post


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = [
            "title",
            "description",
            "created_at",
            "publicity",
            "color",
            "image",
        ]

    def __init__(self, *args, **kwargs):
        super(PostForm, self).__init__(*args, **kwargs)
        self.fields["created_at"].widget.attrs["class"] = "datepicker"


PostFormSet = modelformset_factory(
    Post,
    fields=[
        "title",
        "description",
        "created_at",
        "publicity",
        "color",
        "image",
    ],
    extra=0,
    can_delete=True,
    widgets={"created_at": forms.DateTimeInput(attrs={"class": "datepicker"})},
)
