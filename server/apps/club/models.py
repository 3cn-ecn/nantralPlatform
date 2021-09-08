from django.db import models
from django.db.models import F
from datetime import date

from django.core.cache import cache
from django.core.cache.utils import make_template_fragment_key

from apps.group.models import Group, NamedMembership
from apps.student.models import Student



class Club(Group):
    members = models.ManyToManyField(Student, through='NamedMembershipClub')
    bdx_type = models.ForeignKey(
        'BDX', on_delete=models.SET_NULL, verbose_name='Type de club BDX', null=True, blank=True)
    email = models.EmailField("Email de l'asso", max_length=50, null=True, blank=True)
    meeting_place = models.CharField("Local / Lieu de réunion", max_length=50, null=True, blank=True)
    meeting_hour = models.CharField("Heure et jour de réunion périodique", max_length=50, null=True, blank=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = "club/asso"
        verbose_name_plural = "clubs & assos"
    
    def is_admin(self, user) -> bool:
        is_admin = super(Club, self).is_admin(user)
        if not is_admin and self.bdx_type:
            return self.bdx_type.is_admin(user)
        else:
            return is_admin
    
    def save(self, *args, **kwargs):
        # mise à jour du cache de la liste des clubs
        key = make_template_fragment_key('club_list')
        cache.delete(key)
        # enregistrement
        super().save(*args, **kwargs)


class BDX(Club):
    '''Groupe représentant un BDX.'''

    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = "BDX"



class NamedMembershipClub(NamedMembership):
    group = models.ForeignKey(Club, on_delete=models.CASCADE)
    function = models.CharField(
        verbose_name='Rôle (facultatif)', max_length=200, blank=True)
    date_begin = models.DateField(verbose_name='Date de début', default=date.today)
    date_end = models.DateField(verbose_name='Date de fin (facultatif)', blank=True, null=True)
    order = models.IntegerField(verbose_name='Hiérarchie', default=0)

    @property
    def year(self, **kwargs):
        '''Renvoie l'année scolaire où l'étudiant est devenu membre.
           On renvoie seulement la 2eme année de l'année scolaire.'''
        y = self.date_begin.year
        m = self.date_begin.month
        if m >= 8:
            return y + 1
        else:
            return y