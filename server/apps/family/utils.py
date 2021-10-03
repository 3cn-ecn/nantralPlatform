from django.contrib.auth.models import User
from django.core.cache import cache
from django.utils import timezone

from .models import MembershipFamily, Family, Affichage


def scholar_year(date=timezone.now()):
    """Retourne l'année scolaire au lieu de l'année civile"""
    year = date.year
    month = date.month
    if month < 7:
        year -= 1
    return year


def read_phase():
    """Lis la phase de parrainage où on est rendus depuis le cache."""
    phase = cache.get('family_phase')
    if not phase:
        try:
            phase = Affichage.objects.first().phase
        except Exception:
            Affichage().save()
            phase = Affichage.objects.first().phase
        cache.set('family_phase', phase, 3600)
    return phase


def get_membership(user:User, year=scholar_year()) -> MembershipFamily:
    '''Retourner l'objet membership d'un utilisateur en fonction de l'année'''
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


def is_1A(user:User, membership:MembershipFamily=None, year=scholar_year()) -> bool:
    """Vérifie si un utilisateur est en preière année ou non. Possibilité
    d'ajouter l'objet membership en argument si on le possède déjà pour ne pas
    le rechercher plusieurs fois dans la base de données."""
    if not membership: 
        membership = get_membership(user, year)
    if membership:
        return membership.role == '1A'
    else:
        promo = user.student.promo
        return promo == scholar_year()
        


def get_family(user:User, membership:MembershipFamily=None, year=scholar_year()) -> Family:
    """Obtenir la famille d'un utilisateur pour une année donnée (par défaut l'année en cours).
    Possibilité de donner l'objet membership pour aller plus vite si on l'a déjà."""
    if not membership:
        membership = get_membership(user, year)
    if membership:
        return membership.group
    else:
        return None


def show_sensible_data(user:User, membership:MembershipFamily=None) -> bool:
    """Décide si on doit montrer les données sensibles : on les montre pour
    les 2A+ et pour les 1A après la chasse aux parrains (phase > 3)."""
    if not membership:
        membership = get_membership(user)
    if membership:
        phase = read_phase()
        first_year = is_1A(user, membership)
        show = (not first_year) or (phase >= 4)
        return show
    else:
        return False

