from django import forms

from .models import Post


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'description', 'location',
                  'publication_date', 'publicity', 'color', 'image']

    def __init__(self, *args, **kwargs):
        super(PostForm, self).__init__(*args, **kwargs)
        self.fields['date'].widget.attrs['class'] = 'datepicker'
