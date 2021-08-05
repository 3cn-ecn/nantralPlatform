from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.urls.base import reverse
from django.template.loader import render_to_string
from django.utils import timezone

from django_ckeditor_5.fields import CKEditor5Field

from apps.student.models import Student
from apps.utils.upload import PathAndRename
from apps.utils.github import create_issue, close_issue
from apps.utils.compress import compressModelImage
from apps.utils.slug import *


path_and_rename_group = PathAndRename("groups/logo/group")


class Group(models.Model):
    '''Modèle abstrait servant de modèle pour tous les types de Groupes.'''

    # Nom du groupe
    name = models.CharField(verbose_name='Nom du groupe',
                            unique=True, max_length=100)
    alt_name = models.CharField(
        verbose_name='Nom alternatif', max_length=100, null=True, blank=True)

    # présentation
    logo = models.ImageField(verbose_name='Logo du groupe',
                             blank=True, null=True, upload_to=path_and_rename_group)
    summary = models.CharField('Résumé', max_length=500, null=True, blank=True)
    description = CKEditor5Field(
        verbose_name='Description du groupe', blank=True)
    video1 = models.URLField(
        'Lien vidéo 1', max_length=200, null=True, blank=True)
    video2 = models.URLField(
        'Lien vidéo 2', max_length=200, null=True, blank=True)

    # paramètres techniques
    members = models.ManyToManyField(
        Student, verbose_name='Membres du groupe', related_name='%(class)s_members', through='NamedMembership')
    slug = models.SlugField(max_length=40, unique=True, blank=True)
    modified_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name

    def is_admin(self, user: User) -> bool:
        """Indicates if a user is admin."""
        if user.is_anonymous or not user.is_authenticated or not hasattr(user, 'student'):
            return False
        student = Student.objects.filter(user=user).first()
        if user.is_superuser or user.is_staff:
            return True
        if self.is_member(user):
            members_list = self.members.through.objects.filter(group=self)
            my_member = members_list.filter(student=student).first()
            return my_member.admin
        return False

    def is_member(self, user: User) -> bool:
        """Indicates if a user is member."""
        if user.is_anonymous or not user.is_authenticated or not hasattr(user, 'student'):
            return False
        return user.student in self.members.all()

    def save(self, *args, **kwargs):
        # cration du slug si non-existant ou corrompu
        if not self.slug:
            slug = slugify(self.name)
            if type(self).objects.filter(slug=slug):
                id = 1
                while type(self).objects.filter(slug=f'{slug}-{id}'): id += 1
                slug = f'{slug}-{id}'
            self.slug = slug
        # compression des images
        compressModelImage(self, 'logo', size=(500,500), contains=True)
        # enregistrement
        super(Group, self).save(*args, **kwargs)

    @property
    def app(self):
        return self._meta.app_label
    
    @property
    def full_slug(self):
        return f'{self.app}--{self.slug}'
    
    @property
    def get_absolute_url(self):
        return reverse(self.app+':detail', kwargs={'slug': self.slug})
    
    @property
    def modelName(self):
        '''Plural Model name, used in templates'''
        return self.__class__._meta.verbose_name_plural


class NamedMembership(models.Model):
    admin = models.BooleanField(default=False)
    student = models.ForeignKey(to=Student, on_delete=models.CASCADE)
    group = models.ForeignKey(to=Group, on_delete=models.CASCADE)

    class Meta:
        abstract = True


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
        group = get_object_from_full_slug(self.group)
        title = f'[Admin Req] {group} - {self.student}'
        body = f'<a href="{self.accept_url}">Accepter</a> </br>\
            <a href="{self.deny_url}">Refuser</a>'
        self.issue = create_issue(title=title, body=body)
        super(AdminRightsRequest, self).save()

    @property
    def accept_url(self):
        app, slug = get_tuple_from_full_slug(self.group)
        return f"http://{self.domain}{reverse(app+':accept-admin-req', kwargs={'slug': slug,'id': self.id})}"

    @property
    def deny_url(self):
        app, slug = get_tuple_from_full_slug(self.group)
        return f"http://{self.domain}{reverse(app+':deny-admin-req', kwargs={'slug': slug, 'id': self.id})}"

    def accept(self):
        group = get_object_from_full_slug(self.group)
        if group.is_member(self.student.user):
            membership = group.members.through.objects.get(
                student=self.student.id, group=group)
            membership.admin = True
            membership.save()
        else:
            group.members.through.objects.create(
                student=self.student,
                group=group,
                admin=True
            )
        mail = render_to_string('group/mail/new_admin.html', {
            'group': group,
            'user': self.student.user
        })
        self.student.user.email_user(f'Vous êtes admin de {group}', mail,
                                     'group-manager@nantral-platform.fr', html_message=mail)
        close_issue(self.issue)
        self.delete()

    def deny(self):
        close_issue(self.issue)
        self.delete()


# FIXME Broken since the move of admins inside of members, nice to fix
# @receiver(m2m_changed, sender=Group.members.through)
# def admins_changed(sender, instance, action, pk_set, reverse, model, **kwargs):
#     if isinstance(instance, Group):
#         # FIXME temporary fix because this signal shotguns m2m_changed which other can't
#         # use. To avoid this we check the instance before to make sure it's a group.
#         if action == "post_add":
#             for pk in pk_set:
#                 user = User.objects.get(pk=pk)
#                 mail = render_to_string('group/mail/new_admin.html', {
#                     'group': instance,
#                     'user': user
#                 })
#                 user.email_user(f'Vous êtes admin de {instance}', mail,
#                                 'group-manager@nantral-platform.fr', html_message=mail)
#         elif action == "post_remove":
#             for pk in pk_set:
#                 user = User.objects.get(pk=pk)
#                 mail = render_to_string('group/mail/remove_admin.html', {
#                     'group': instance,
#                     'user': user
#                 })
#                 user.email_user(
#                     f'Vous n\'êtes plus membre de {instance}', mail, 'group-manager@nantral-platform.fr', html_message=mail)
