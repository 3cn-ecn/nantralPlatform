from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.http import HttpRequest
from django.template.loader import render_to_string
from django.urls.base import reverse
from django.utils import timezone

from datetime import timedelta, datetime
from django_ckeditor_5.fields import CKEditor5Field

from apps.maps.models import Place, Map
from apps.student.models import Student

from apps.utils.upload import PathAndRename
from apps.utils.compress import compress_model_image
from apps.utils.slug import SlugModel

from discord_webhook import DiscordWebhook, DiscordEmbed

import logging
logger = logging.getLogger(__name__)


path_and_rename_group = PathAndRename('groups/logo')
path_and_rename_group_banniere = PathAndRename('groups/banniere')


def today() -> datetime:
    """Returns the date of today.

    Returns
    -------
    datetime
        The current date.
    """
    return timezone.now().today()


def one_year_later() -> datetime:
    """Returns the day of today but one year later.

    Returns
    -------
    datetime
        Returns the date in one year.
    """
    return (timezone.now() + timedelta(days=365)).today()


class GroupType(models.Model):
    """
    The type of a group: club, flatshare, etc... with all the group type
    settings.
    """

    # Type infos
    name = models.CharField(
        verbose_name="Nom du type",
        unique=True,
        max_length=20)
    slug = models.SlugField(
        verbose_name="Abréviation du type",
        primary_key=True,
        max_length=10)

    # Maps settings
    map = models.ForeignKey(
        to=Map,
        verbose_name="Carte liée",
        default=False,
        on_delete=models.SET_NULL,
        null=True,
        blank=True)
    place_required = models.BooleanField(
        default=False,
        help_text="Le lieu est disponible seulement si une carte est liée.")
    slug_is_name = models.BooleanField("Slug déduit du nom", default=True)

    # Members settings
    anyone_can_join = models.BooleanField(
        "N'importe qui peut s'ajouter par défaut",
        default=True)
    is_year_group = models.BooleanField(
        "Les groupes n'existent que sur une année scolaire.",
        default=False,
        help_text="Si vrai, les membres n'ont pas de dates.")

    # Group list display settings
    group_by_field = models.CharField(
        "Grouper en catégories selon le champ",
        max_length=30,
        blank=True)
    group_by_label = models.CharField(
        "Label des catégories",
        max_length=100,
        blank=True,
        help_text=("Utiliser la syntaxe Python pour formater le texte avec le "
                   "champ (cf https://docs.python.org/3/library/stdtypes.html#"
                   "str.format)"))

    class Meta:
        verbose_name = "type de groupe"
        verbose_name_plural = "types de groupes"

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("group:list", kwargs={"slug": self.slug})


class Group(models.Model, SlugModel):
    """Database of all groups, with different types: clubs, flatshares..."""

    # General data
    name = models.CharField(
        verbose_name="Nom du groupe",
        unique=True,
        max_length=100)
    short_name = models.CharField(
        verbose_name="Nom abrégé",
        max_length=20,
        blank=True)
    members = models.ManyToManyField(
        Student,
        verbose_name="Membres du groupe",
        related_name='groups',
        through='Membership')

    # Technical data
    group_type = models.ForeignKey(
        to=GroupType,
        verbose_name="Type de groupe",
        on_delete=models.CASCADE)
    parent = models.ForeignKey(
        'Group',
        blank=True,
        null=True,
        on_delete=models.CASCADE)
    order = models.IntegerField("Ordre", default=0)
    year = models.IntegerField(
        "Année du groupe",
        null=True,
        blank=True,
        help_text=("Pour les années scolaires, indiquez seulement la première "
                   "année (de septembre à décembre)"))
    slug = models.SlugField(max_length=40, unique=True, blank=True)
    private = models.BooleanField(
        "Groupe privé",
        default=False,
        help_text=("Un groupe privé n'est visible que par les membres du "
                   "groupe."))
    anyone_can_join = models.BooleanField(
        "N'importe qui peut devenir membre",
        blank=True)
    archived = models.BooleanField(
        "Groupe archivé",
        default=False,
        help_text=("Un groupe archivé ne peut plus avoir de nouveaux membres "
                   "et est masqué des résultats."))

    # Profile
    summary = models.CharField("Résumé", max_length=500, null=True, blank=True)
    description = CKEditor5Field(
        verbose_name="Description du groupe", blank=True)
    icon = models.ImageField(
        verbose_name="Logo du groupe", blank=True, null=True,
        upload_to=path_and_rename_group,
        help_text="Votre logo sera affiché au format 306x306 pixels.")
    banner = models.ImageField(
        verbose_name="Bannière", blank=True, null=True,
        upload_to=path_and_rename_group_banniere,
        help_text="Votre bannière sera affichée au format 1320x492 pixels.")
    video1 = models.URLField(
        "Lien vidéo 1", max_length=200, null=True, blank=True)
    video2 = models.URLField(
        "Lien vidéo 2", max_length=200, null=True, blank=True)

    # Map data
    place = models.ForeignKey(
        to=Place,
        on_delete=models.SET_NULL,
        null=True,
        blank=True)

    # Log infos
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        Student, blank=True, null=True,
        on_delete=models.SET_NULL, related_name='+')
    last_modified_at = models.DateTimeField(auto_now=True)
    last_modified_by = models.ForeignKey(
        Student, blank=True, null=True,
        on_delete=models.SET_NULL, related_name='+')

    class Meta:
        verbose_name = "groupe"

    def __str__(self):
        return self.short_name if self.short_name else self.name

    def is_admin(self, user: User) -> bool:
        """Check if a user has the admin rights for this group.

        Parameters
        ----------
        user : User
            The user to check for.

        Returns
        -------
        bool
            True if the user has admin rights.
        """

        return (
            self.is_member(user)
            and self.membership_set.filter(student=user.student).admin
            or user.is_superuser
        )

    def is_member(self, user: User) -> bool:
        """Check if a user is a member for this group.

        Parameters
        ----------
        user : User
            The user to check for.

        Returns
        -------
        bool
            True if the user is a member of this group.
        """

        return (
            (not user.is_anonymous)
            and user.is_authenticated
            and hasattr(user, 'student')
            and self.members.contains(user.student)
        )

    def save(self, *args, **kwargs) -> None:
        """Save an instance of the model in the database.

        * It creates a slug from the name if it does not already exists.
        * It compresses the icon and banner images
        * It computes the longitude and latitude coordinates if there
          is an address
        * It defines some args to default values set in the type
        """

        self.set_slug(
            (self.short_name if self.short_name else self.name)
            if self.group_type.slug_is_name else f'family-{self.pk}',
            max_length=40)
        self.icon = compress_model_image(
            self, 'icon', size=(500, 500), contains=True)
        self.banner = compress_model_image(
            self, 'banner', size=(1320, 492), contains=False)
        if self.anyone_can_join is None:
            self.anyone_can_join = self.group_type.anyone_can_join
        if self.pk is None:
            self.created_by = self.last_modified_by
        super(Group, self).save(*args, **kwargs)

    def get_absolute_url(self) -> str:
        """Get the absolute url of the model object.

        Returns
        -------
        str
            The absolute url of the model object.
        """
        return reverse('group:detail', kwargs={'slug': self.slug})


class Membership(models.Model):
    """A class for memberships of each group."""

    student = models.ForeignKey(to=Student, on_delete=models.CASCADE)
    group = models.ForeignKey(to=Group, on_delete=models.CASCADE)
    admin = models.BooleanField(default=False)
    summary = models.CharField("Résumé", max_length=50, null=True, blank=True)
    description = models.TextField(verbose_name="Description", blank=True)
    admin_request = models.BooleanField(
        "A demandé à devenir admin", default=False)
    admin_request_messsage = models.TextField(
        "Raison de la demande à devenir admin", blank=True)
    order = models.IntegerField("Ordre", default=0)
    begin_date = models.DateField(
        verbose_name="Date de début",
        default=today,
        blank=True,
        null=True)
    end_date = models.DateField(
        verbose_name="Date de fin",
        default=one_year_later,
        blank=True,
        null=True)

    class Meta:
        unique_together = ('student', 'group')
        ordering = ['group', 'order', 'student']
        verbose_name = "membre"

    def __str__(self):
        return self.student.__str__()

    def save(self, *args, **kwargs) -> None:
        """Save the membership object."""
        # default dates for year groups
        if self.group_type.is_year_group:
            self.begin_date = timezone.date(self.group.year, 8, 1)
            self.end_date = timezone.date(self.group.year + 1, 7, 31)
        # if member becomes admin, remove the admin request
        if self.admin and self.admin_request:
            self.admin_request = False
            self.admin_request_messsage = ""
        super(Membership, self).save(*args, **kwargs)

    def create_admin_request(self, message: str, request: HttpRequest) -> None:
        """A method for a member to ask for admin rights.

        Parameters
        ----------
        message : str
            A message from the member explaining why he/she wants the admin
            rights on the group.
        request : HttpRequest
            The request associated with the view from which we ask for admin
            rights (in order to get the full url)
        """

        self.admin_request = True
        self.admin_request_messsage = message
        self.save()
        # send a message on the discord channel
        accept_uri = request.build_absolute_uri(
            reverse('group:accept-admin-req', kwargs={'member': self.id}))
        deny_uri = request.build_absolute_uri(
            reverse('group:deny-admin-req', kwargs={'member': self.id}))
        webhook = DiscordWebhook(
            url=settings.DISCORD_ADMIN_MODERATION_WEBHOOK)
        embed = DiscordEmbed(
            title=(
                f"{self.student} ({self.summary}) demande à devenir admin "
                f"de {self.group}"),
            description=self.admin_request_messsage,
            color=242424)
        embed.add_embed_field(
            name='Accepter',
            value=f"[Accepter]({accept_uri})",
            inline=True)
        embed.add_embed_field(
            name='Refuser',
            value=f"[Refuser]({deny_uri})",
            inline=True)
        if (self.student.picture):
            embed.thumbnail = {"url": self.student.picture.url}
        webhook.add_embed(embed)
        webhook.execute()

    def accept_admin_request(self) -> None:
        """Accept an admin request."""
        self.admin = True
        self.save()
        mail = render_to_string('abstract_group/mail/new_admin.html', {
            'group': self.group,
            'user': self.student.user
        })
        self.student.user.email_user(f'Vous êtes admin de {self.group}', mail,
                                     from_email=None, html_message=mail)
        webhook = DiscordWebhook(
            url=settings.DISCORD_ADMIN_MODERATION_WEBHOOK)
        embed = DiscordEmbed(
            title=(f'La demande de {self.student} pour rejoindre {self.group} '
                   'a été acceptée.'),
            description="",
            color=00000)
        webhook.add_embed(embed)
        webhook.execute()

    def deny_admin_request(self) -> None:
        """Deny an admin request."""
        self.admin_request = False
        self.admin_request_messsage = ""
        self.save()
        webhook = DiscordWebhook(
            url=settings.DISCORD_ADMIN_MODERATION_WEBHOOK)
        embed = DiscordEmbed(
            title=(f'La demande de {self.student} pour rejoindre {self.group} '
                   'a été refusée.'),
            description="",
            color=00000)
        webhook.add_embed(embed)
        webhook.execute()
