from django.shortcuts import render
from django.views import generic

from apps.student.models import Student

def camarche(request):
    return render(request, 'search_bar/truc.html', {})

def search_bar(request):
    if request.method == 'POST':
        saisie = request.POST.get('saisie', '')
        result = Student.objects.filter(user__first_name__contains=saisie)
        return render(request, 'search_bar/index.html',{'saisie':saisie, 'result':result})
    else:
        return render(request, 'search_bar/index.html',{})
