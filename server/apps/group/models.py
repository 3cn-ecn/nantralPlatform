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
from apps.utils.upload import PathAndRename
from apps.utils.github import create_issue, close_issue



if settings.DEBUG:
    path_and_rename_club = PathAndRename("./static/upload/groups/logo/club")
    path_and_rename_liste = PathAndRename("./static/upload/groups/logo/liste")
    path_and_rename_group = PathAndRename("./static/upload/groups/logo/group")
    path_and_rename_club_banniere = PathAndRename(
        "./static/upload/groups/banniere/club")
    path_and_rename_liste_banniere = PathAndRename(
        "./static/upload/groups/banniere/club")
else:
    path_and_rename_club = PathAndRename("groups/logo/club")
    path_and_rename_liste = PathAndRename("groups/logo/liste")
    path_and_rename_group = PathAndRename("groups/logo/group")
    path_and_rename_club_banniere = PathAndRename("groups/banniere/club")
    path_and_rename_liste_banniere = PathAndRename("groups/banniere/club")


class Group(models.Model):
    '''Modèle abstrait servant de modèle pour tous les types de Groupes.'''

    name = models.CharField(verbose_name='Nom du groupe',
                            unique=True, max_length=200)
    description = models.TextField(
        verbose_name='Description du groupe', blank=True)
    admins = models.ManyToManyField(
        Student, verbose_name='Admins du groupe', related_name='%(class)s_admins', blank=True)
    members = models.ManyToManyField(
        Student, verbose_name='Membres du groupe', related_name='%(class)s_members')
    logo = models.ImageField(verbose_name='Logo du groupe',
                             blank=True, null=True, upload_to=path_and_rename_group)
    slug = models.SlugField(max_length=40, unique=True, blank=True)
    # parent = models.SlugField(max_length=40, blank=True, null=True)
    modified_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

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

    # @property
    # def get_parent(self):
        # """Get the parent group of this group."""
        # if self.parent is None or self.parent == self.slug:
            # return None
        # return Group.get_group_by_slug(self.parent)

    @staticmethod
    def get_group_by_slug(slug:  str):
        """Get a group from a slug."""
        type_slug = slug.split('--')[0]
        if type_slug == 'club':
            return Club.objects.get(slug=slug)
        elif type_slug == 'liste':
            return Liste.objects.get(slug=slug)
        elif type_slug == 'bdx':
            return BDX.objects.get(slug=slug)
        else:
            raise Exception('Unknown group')

    @property
    def get_absolute_url(self):
        return reverse('group:detail', kwargs={'group_slug': self.slug})


class BDX(Group):
    '''Groupe représentant un BDX.'''

    members = models.ManyToManyField(Student, through='NamedMembershipBDX')
    alt_name = models.CharField(
        verbose_name='Nom abrégé', max_length=200, null=True, blank=True)
    logo = models.ImageField(verbose_name='Logo du club',
                             blank=True, null=True, upload_to=path_and_rename_club)
    banniere = models.ImageField(
        verbose_name='Bannière', blank=True, null=True, upload_to=path_and_rename_club_banniere)
    # social = models.ManyToManyField('ReseauSocial', through='LienSocialClub')

    def save(self, *args, **kwargs):
        self.slug = f'bdx--{slugify(self.name)}'
        super(BDX, self).save(*args, **kwargs)


class NamedMembershipBDX(models.Model):
    function = models.CharField(
        verbose_name='Poste occupé', max_length=200, blank=True)
    year = models.IntegerField(
        verbose_name='Année du poste', blank=True, null=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    bdx = models.ForeignKey(BDX, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('function', 'year', 'student', 'club')



class Club(Group):
    members = models.ManyToManyField(Student, through='NamedMembershipClub')
    alt_name = models.CharField(
        verbose_name='Nom abrégé', max_length=200, null=True, blank=True)
    bdx_type = models.ForeignKey(BDX, on_delete=models.SET_NULL, verbose_name='Type de club BDX')
    logo = models.ImageField(verbose_name='Logo du club',
                             blank=True, null=True, upload_to=path_and_rename_club)
    banniere = models.ImageField(
        verbose_name='Bannière', blank=True, null=True, upload_to=path_and_rename_club_banniere)
    social = models.ManyToManyField('ReseauSocial', through='LienSocialClub')

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



class Liste(Group):
    liste_type = models.ForeignKey(BDX, on_delete=models.SET_NULL, verbose_name='Type de BDX')
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


class ReseauSocial(models.Model):
    name = models.CharField(verbose_name='Nom', max_length=20)
    color = models.CharField(
        verbose_name='Couleur en hexadécimal', max_length=7)
    icon_name = models.CharField(
        verbose_name="Nom Bootstrap de l'icône", max_length=20)

    class Meta:
        verbose_name = "Réseau Social"
        verbose_name_plural = "Réseaux Sociaux"

    def __str__(self):
        return self.name


class LienSocialClub(models.Model):
    url = models.CharField(verbose_name='URL', max_length=200)
    reseau = models.ForeignKey(ReseauSocial, on_delete=models.CASCADE)
    club = models.ForeignKey(Club, on_delete=models.CASCADE)

    def __str__(self):
        return self.url


