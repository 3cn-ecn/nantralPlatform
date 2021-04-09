from django import forms
from django.forms import modelformset_factory

from .models import Post


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'description',
                  'publication_date', 'publicity', 'color', 'image']

    def __init__(self, *args, **kwargs):
        super(PostForm, self).__init__(*args, **kwargs)
        self.fields['publication_date'].widget.attrs['class'] = 'datepicker'


PostFormSet = modelformset_factory(
    Post,
    fields=['title', 'description',
            'publication_date', 'publicity', 'color', 'image'],
    extra=0,
    can_delete=True,
    widgets={
        'publication_date': forms.DateTimeInput(attrs={'class': 'datepicker'})
    }
)
