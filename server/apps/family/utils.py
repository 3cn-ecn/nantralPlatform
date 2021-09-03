from django.contrib.auth.models import User
from django.core.cache import cache
from datetime import date

from .models import MembershipFamily, Family, Affichage


def read_phase():
    phase = cache.get('family_phase2')
    if not phase:
        try:
            phase = Affichage.objects.first().phase
        except Exception:
            Affichage().save()
            phase = Affichage.objects.first().phase
        cache.set('family_phase2', phase, 3600)
    return phase


def get_membership(user:User, year=date.today().year) -> MembershipFamily:
    '''return the membership of this year'''
    try:
        member = MembershipFamily.objects.get(
            student = user.student,
            role = '2A+',
            group__year = year,
        )
        return member
    except MembershipFamily.DoesNotExist:
        try:
            member = MembershipFamily.objects.get(
                student = user.student,
                role = '1A'
            )
            return member
        except MembershipFamily.DoesNotExist:
            return None


def is_1A(user:User, membership:MembershipFamily=None, year=date.today().year) -> bool:
    if not membership: 
        membership = get_membership(user, year)
    if membership:
        return membership.role == '1A'
    else:
        promo = user.student.promo
        return promo == date.today().year
        


def get_family(user:User, membership:MembershipFamily=None, year=date.today().year) -> Family:
    if not membership:
        membership = get_membership(user, year)
    if membership:
        return membership.group
    else:
        return None


def show_sensible_data(user:User, membership:MembershipFamily=None) -> bool:
    phase = read_phase()
    first_year = is_1A(user, membership)
    show = (not first_year) or (phase >= 4)
    return show

