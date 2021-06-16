from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from django.utils.text import slugify
from django.urls.base import reverse
from django.template.loader import render_to_string
from django.utils import timezone

from django.conf import settings

from apps.student.models import Student
#from apps.sociallink.models import SocialNetwork, SocialLink
from apps.utils.upload import PathAndRename
from apps.utils.github import create_issue, close_issue


if settings.DEBUG:
    path_and_rename_group = PathAndRename("./static/upload/groups/logo/group")
else:
    path_and_rename_group = PathAndRename("groups/logo/group")


class Group(models.Model):
    '''Modèle abstrait servant de modèle pour tous les types de Groupes.'''

    name = models.CharField(verbose_name='Nom du groupe',
                            unique=True, max_length=200)
    alt_name = models.CharField(
        verbose_name='Nom alternatif', max_length=200, null=True, blank=True)
    description = models.TextField(
        verbose_name='Description du groupe', blank=True)
    # admins = models.ManyToManyField(
       # Student, verbose_name='Admins du groupe', related_name='%(class)s_admins', blank=True)
    members = models.ManyToManyField(Student, verbose_name='Membres du groupe', related_name='%(class)s_members', through='NamedMembership')
    logo = models.ImageField(verbose_name='Logo du groupe',blank=True, null=True, upload_to=path_and_rename_group)
    slug = models.SlugField(max_length=40, unique=True, blank=True)
    modified_date = models.DateTimeField(auto_now=True)
    #social = models.ManyToManyField('SocialNetwork', through='SocialLink')

    class Meta:
        abstract = True

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = f'{type(self).__name__}--{slugify(self.name)}'
        super(Group, self).save(*args, **kwargs)

    def is_admin(self, user: User) -> bool:
        """Indicates if a user is admin."""
        if user.is_superuser or user.is_staff:
            return True
        student = Student.objects.get(user=user)
        if self.type_bdx is not None:
            if student in self.type_bdx.members.filter(admin=True):
                return True
        return student in self.members.filter(admin=True)
        #return student in self.admins.all() or self.get_parent is not None and self.get_parent.is_admin(user)

    def is_member(self, user: User) -> bool:
        """Indicates if a user is member."""
        if user.is_anonymous or not user.is_authenticated:
            return False
        if not user.student:
            return False
        student = Student.objects.filter(user=user).first()
        return student in self.members.all()

    def save(self, *args, **kwargs):
        self.slug = f'{type(self).__name__.lower()}--{slugify(self.name)}'
        super(Group, self).save(*args, **kwargs)

    @staticmethod
    def get_group_by_slug(slug:  str):
        """Get a group from a slug."""
        type_slug = slug.split('--')[0]
        if type_slug == 'club':
            from apps.club.models import Club
            return Club.objects.get(slug=slug)
        elif type_slug == 'liste':
            from apps.liste.models import Liste
            return Liste.objects.get(slug=slug)
        elif type_slug == 'bdx':
            from apps.club.models import BDX
            return BDX.objects.get(slug=slug)
        else:
            raise Exception('Unknown group')

    @property
    def get_absolute_url(self):
        return reverse('group:detail', kwargs={'group_slug': self.slug})


class NamedMembership(models.Model):
    admin = models.BooleanField(default=False)
    student = models.ForeignKey(to=Student, on_delete=models.CASCADE)

    class Meta:
        abstract = True

'''
@receiver(m2m_changed, sender=Group.members.admin.through)
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
'''

class AdminRightsRequest(models.Model):
    """A model to request admin rights on a group."""
    group = models.SlugField(verbose_name="Groupe demandé.")
    student = models.ForeignKey(to=Student, on_delete=models.CASCADE)
    date = models.DateField(
        verbose_name="Date de la requête", default=timezone.now)
    reason = models.CharField(
        max_length=100, verbose_name="Raison de la demande", blank=True)
    domain = models.CharField(max_length=64)
    issue = models.IntegerField(blank=True)

    def save(self, domain: str, *args, **kwargs):
        self.date = timezone.now()
        self.domain = domain
        self.issue = 0
        super(AdminRightsRequest, self).save()
        group = Group.get_group_by_slug(self.group)
        title = f'[Admin Req] {group} - {self.student}'
        body = f'<a href="{self.accept_url}">Accepter</a> </br>\
            <a href="{self.deny_url}">Refuser</a>'
        self.issue = create_issue(title=title, body=body)
        super(AdminRightsRequest, self).save()

    @property
    def accept_url(self):
        return f"http://{self.domain}{reverse('group:accept-admin-req', kwargs={'group_slug': self.group,'id': self.id})}"

    @property
    def deny_url(self):
        return f"http://{self.domain}{reverse('group:deny-admin-req', kwargs={'group_slug': self.group, 'id': self.id})}"

    def accept(self):
        group = Group.get_group_by_slug(self.group)
        group.admins.add(self.student)
        close_issue(self.issue)
        self.delete()

    def deny(self):
        close_issue(self.issue)
        self.delete()
