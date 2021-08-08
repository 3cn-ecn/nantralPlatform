from django import forms

from apps.student.models import Student
from .models import Family



class CreateFamilyForm(forms.ModelForm):
    member1 = forms.ModelChoiceField(queryset=Student.objects.all(), required=True)
    member2 = forms.ModelChoiceField(queryset=Student.objects.all(), required=False)
    member3 = forms.ModelChoiceField(queryset=Student.objects.all(), required=False)
    member4 = forms.ModelChoiceField(queryset=Student.objects.all(), required=False)
    member5 = forms.ModelChoiceField(queryset=Student.objects.all(), required=False)
    member6 = forms.ModelChoiceField(queryset=Student.objects.all(), required=False)
    member7 = forms.ModelChoiceField(queryset=Student.objects.all(), required=False)
    
    class Meta:
        model = Family
        fields = ['name', 'summary', 'member1', 'member2', 'member3',
                  'member4', 'member5', 'member6', 'member7', 
                  'non_subscribed_members']