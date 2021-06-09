from django.db import models
from django.conf import settings

from apps.group.models import Group
from apps.student.models import Student
from apps.utils.upload import PathAndRename


if settings.DEBUG:
    path_and_rename_club = PathAndRename("./static/upload/groups/logo/club")
    path_and_rename_club_banniere = PathAndRename(
        "./static/upload/groups/banniere/club")
else:
    path_and_rename_club = PathAndRename("groups/logo/club")
    path_and_rename_club_banniere = PathAndRename("groups/banniere/club")


class Club(Group):
    members = models.ManyToManyField(Student, through='NamedMembershipClub')
    alt_name = models.CharField(
        verbose_name='Nom abrégé', max_length=200, null=True, blank=True)
    bdx_type = models.ForeignKey(
        'BDX', on_delete=models.SET_NULL, verbose_name='Type de club BDX', null=True, blank=True)
    logo = models.ImageField(verbose_name='Logo du club',
                             blank=True, null=True, upload_to=path_and_rename_club)
    banniere = models.ImageField(
        verbose_name='Bannière', blank=True, null=True, upload_to=path_and_rename_club_banniere)


class BDX(Club):
    '''Groupe représentant un BDX.'''


class NamedMembershipClub(models.Model):
    function = models.CharField(
        verbose_name='Poste occupé', max_length=200, blank=True)
    year = models.IntegerField(
        verbose_name='Année du poste', blank=True, null=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    group = models.SlugField(verbose_name='Groupe')

    class Meta:
        unique_together = ('function', 'year', 'student', 'group')
