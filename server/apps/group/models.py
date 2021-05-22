from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from django.utils.text import slugify
from django.urls.base import reverse
from django.template.loader import render_to_string

from django.conf import settings

from apps.student.models import Student
from apps.utils.upload import PathAndRename


TYPE_BDX = [
    ('BDA', 'Bureau des Arts'),
    ('BDE', 'Bureau des Élèves'),
    ('BDS', 'Bureau des Sports'),
    ('Asso', 'Association')
]

if settings.DEBUG:
    path_and_rename_club = PathAndRename("./static/upload/groups/logo/club")
    path_and_rename_liste = PathAndRename("./static/upload/groups/logo/liste")
    path_and_rename_group = PathAndRename("./static/upload/groups/logo/group")
else:
    path_and_rename_club = PathAndRename("groups/logo/club")
    path_and_rename_liste = PathAndRename("groups/logo/liste")
    path_and_rename_group = PathAndRename("groups/logo/group")


class Group(models.Model):
    name = models.CharField(verbose_name='Nom du groupe', unique=True, max_length=200)
    description = models.TextField(verbose_name='Description du groupe', blank=True)
    admins = models.ManyToManyField(Student, verbose_name='Administrateur.rice.s du groupe', related_name='%(class)s_admins', blank=True)
    members = models.ManyToManyField(Student, verbose_name='Membres du groupe', related_name='%(class)s_members')
    logo = models.ImageField(verbose_name='Logo du groupe', blank=True, null=True, upload_to=path_and_rename_group)
    slug = models.SlugField(max_length=40, unique=True, blank=True)
    parent = models.SlugField(max_length=40, blank=True, null=True)

    class Meta:
        abstract = True
        ordering = ['name']

    def __str__(self):
        return self.name

    def is_admin(self, user: User) -> bool:
        """Indicates if a user is admin."""
        if user.is_superuser or user.is_staff:
            return True
        student = Student.objects.filter(user=user).first()
        return student in self.admins.all() or self.get_parent is not None and self.get_parent.is_admin(user)

    def is_member(self, user: User) -> bool:
        """Indicates if a user is member."""
        if user.is_anonymous or not user.is_authenticated:
            return False
        if not user.student:
            return False
        student = Student.objects.filter(user=user).first()
        return student in self.members.all()

    @property
    def get_parent(self):
        """Get the parent group of this group."""
        if self.parent is None or self.parent == self.slug:
            return None
        return Group.get_group_by_slug(self.parent)

    @staticmethod
    def get_group_by_slug(slug:  str):
        """Get a group from a slug."""
        type_slug = slug.split('--')[0]
        if type_slug == 'club':
            return Club.objects.get(slug=slug)
        elif type_slug == 'liste':
            return Liste.objects.get(slug=slug)
        else:
            return None

    @property
    def get_absolute_url(self):
        return reverse('group:detail', kwargs={'group_slug': self.slug})


class Club(Group):
    members = models.ManyToManyField(Student, through='NamedMembershipClub')
    bdx_type = models.CharField(verbose_name='Type de club BDX', choices=TYPE_BDX, max_length=60)
    logo = models.ImageField(verbose_name='Logo du club',
                             blank=True, null=True, upload_to=path_and_rename_club)

    def save(self, *args, **kwargs):
        self.slug = f'club--{slugify(self.name)}'
        super(Club, self).save(*args, **kwargs)


class NamedMembershipClub(models.Model):
    function = models.CharField(
        verbose_name='Poste occupé', max_length=200, blank=True)
    year = models.IntegerField(
        verbose_name='Année du poste', blank=True, null=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    club = models.ForeignKey(Club, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('function', 'year', 'student', 'club')


TYPE_LISTE = [
    ('BDA', 'Bureau des Arts'),
    ('BDE', 'Bureau des Élèves'),
    ('BDS', 'Bureau des Sports')
]


class Liste(Group):
    liste_type = models.CharField(
        verbose_name='Type de liste BDX', choices=TYPE_LISTE, max_length=60)
    year = models.IntegerField(
        verbose_name='Année de la liste', blank=True, null=True)
    members = models.ManyToManyField(Student, through='NamedMembershipList')
    logo = models.ImageField(verbose_name='Logo de la liste',
                             blank=True, null=True, upload_to=path_and_rename_liste)

    def save(self, *args, **kwargs):
        self.slug = f'liste--{slugify(self.name)}'
        super(Liste, self).save(*args, **kwargs)


class NamedMembershipList(models.Model):
    function = models.CharField(
        verbose_name='Poste occupé', max_length=200, blank=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    liste = models.ForeignKey(Liste, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('function', 'student', 'liste')


@receiver(m2m_changed, sender=Group.admins.through)
def admins_changed(sender, instance, action, pk_set, reverse, model, **kwargs):
    if isinstance(instance, Group):
        # FIXME temporary fix because this signal shotguns m2m_changed which other can't
        # use. To avoid this we check the instance before to make sure it's a group.
        if action == "post_add":
            for pk in pk_set:
                user = User.objects.get(pk=pk)
                mail = render_to_string('group/mail/new_admin.html', {
                    'group': instance,
                    'user': user
                })
                user.email_user(f'Vous êtes admin de {instance}', mail,
                                'group-manager@nantral-platform.fr', html_message=mail)
        elif action == "post_remove":
            for pk in pk_set:
                user = User.objects.get(pk=pk)
                mail = render_to_string('group/mail/remove_admin.html', {
                    'group': instance,
                    'user': user
                })
                user.email_user(
                    f'Vous n\'êtes plus admin de {instance}', mail, 'group-manager@nantral-platform.fr', html_message=mail)
