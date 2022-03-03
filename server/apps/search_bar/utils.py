from django.db.models import Q

from apps.student.models import Student
from apps.club.models import Club
from apps.roommates.models import Roommates

def get_searched(request):
    saisie = request.POST.get('saisie', '').split(' ')
    searched_result = {'saisie':' '.join(saisie)}

    searched_result['students'] = get_students(saisie)
    searched_result['clubs'] = get_clubs(saisie)
    searched_result['colocs'] = get_colocs(saisie)

    searched_result['empty'] = not (searched_result['clubs'] or searched_result['students']or searched_result['colocs'])
    
    return searched_result

def get_students(saisie):
    result = Student.objects.none()
    if len(saisie) > 1:
        for i in range(len(saisie)):
            for j in range(len(saisie)):
                if i != j:
                    result = result | Student.objects.filter((Q(user__first_name__contains=saisie[i]) & Q(user__last_name__contains = saisie[j])) | (Q(user__first_name__contains=saisie[j]) & Q(user__last_name__contains=saisie[i])))
    if len(result) == 0:
        for x in saisie:
            result = result | Student.objects.filter((Q(user__first_name__contains=x)) | Q(user__last_name__contains=x))
    return result

def get_clubs(saisie):
    result = Club.objects.none()
    result = Club.objects.filter(name__contains=' '.join(saisie))
    if len(result) == 0:
        for x in saisie:
            result = result | Club.objects.filter(name__contains=x)
    return result

def get_colocs(saisie):
    result = Roommates.objects.none()
    result = Roommates.objects.filter(name__contains=' '.join(saisie))
    if len(result) == 0:
        for x in saisie:
            result = result | Roommates.objects.filter(name__contains=x)
    return result