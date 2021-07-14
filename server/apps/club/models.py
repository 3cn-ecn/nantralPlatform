from django.db import models
from django.db.models import F
from django.conf import settings
from datetime import date
from django.urls.base import reverse
import datetime

from apps.group.models import Group, NamedMembership
from apps.student.models import Student
from apps.utils.upload import PathAndRename


path_and_rename_club = PathAndRename("groups/logo/club")
path_and_rename_club_banniere = PathAndRename("groups/banniere/club")


class Club(Group):
    members = models.ManyToManyField(Student, through='NamedMembershipClub')
    bdx_type = models.ForeignKey(
        'BDX', on_delete=models.SET_NULL, verbose_name='Type de club BDX', null=True, blank=True)
    logo = models.ImageField(
        verbose_name='Logo du club', blank=True, null=True, 
        upload_to=path_and_rename_club,
        help_text="Votre logo sera affiché au format 306x306 pixels.")
    banniere = models.ImageField(
        verbose_name='Bannière', blank=True, null=True, 
        upload_to=path_and_rename_club_banniere,
        help_text="Votre bannière sera affichée au format 1320x492 pixels.")
    
    class Meta:
        ordering = [F('bdx_type').asc(nulls_first=True), 'name']
    
    @property
    def group_type(self):
        return 'club'


class BDX(Club):
    '''Groupe représentant un BDX.'''

    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = "BDX"



class NamedMembershipClub(NamedMembership):
    group = models.ForeignKey(Club, on_delete=models.CASCADE)
    function = models.CharField(
        verbose_name='Poste occupé', max_length=200, blank=True)
    date_begin = models.DateField(verbose_name='Date de début', default=date.today)
    date_end = models.DateField(verbose_name='Date de fin', blank=True, null=True)
    order = models.IntegerField(verbose_name='Hiérarchie', default=0)

    @property
    def year(self, **kwargs):
        '''Renvoie l'année scolaire où l'étudiant est devenu membre.
           On renvoie seulement la 2eme année de l'année scolaire.'''
        y = self.date_begin.strftime('%Y')
        m = self.date_begin.strftime('%m')
        if m >= 8:
            return y + 1
        else:
            return y