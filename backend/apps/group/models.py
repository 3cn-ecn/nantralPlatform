from datetime import timedelta, date

from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.template.loader import render_to_string
from django.urls.base import reverse
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from django_ckeditor_5.fields import CKEditor5Field
from discord_webhook import DiscordWebhook, DiscordEmbed

from apps.maps.models import Place, Map
from apps.sociallink.models import SocialLink
from apps.student.models import Student
from apps.utils.upload import PathAndRename
from apps.utils.compress import compress_model_image
from apps.utils.slug import SlugModel


import logging
logger = logging.getLogger(__name__)


path_and_rename_group = PathAndRename('groups/logo')
path_and_rename_group_banniere = PathAndRename('groups/banniere')
path_and_rename_group_type = PathAndRename('groups/types')


def today() -> date:
    """Returns the date of today.

    Returns
    -------
    datetime
        The current date.
    """
    return timezone.now().date()


def one_year_later() -> date:
    """Returns the day of today but one year later.

    Returns
    -------
    datetime
        Returns the date in one year.
    """
    return (timezone.now() + timedelta(days=365)).date()


class GroupType(models.Model):
    """
    The type of a group: club, flatshare, etc... with all the group type
    settings.
    """

    # Type infos
    name = models.CharField(
        verbose_name=_("Nom du type"),
        unique=True,
        max_length=20)
    slug = models.SlugField(
        verbose_name=_("Abréviation du type"),
        primary_key=True,
        max_length=10)
    icon = models.ImageField(
        verbose_name=_("Logo"),
        blank=True,
        null=True,
        upload_to=path_and_rename_group_type)

    # Maps settings
    map = models.ForeignKey(
        to=Map,
        verbose_name=_("Carte liée"),
        default=False,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text=_("Les groupes peuvent avoir un lieu uniquement si une carte "
                    "est liée."))
    place_required = models.BooleanField(
        verbose_name=_("Lieu obligatoire"),
        default=False,
        help_text=_("Uniquement si une carte est liée."))
    slug_is_name = models.BooleanField(
        verbose_name=_("Slug basé sur le nom"),
        default=True,
        help_text=_("Par défaut, le nom du groupe est utilisé pour construire "
                    "le slug."))

    # Members settings
    is_year_group = models.BooleanField(
        _("Groupes annuels."),
        default=False,
        help_text=_("Les groupes sont liés à une année scolaire. "
                    "Aucunes dates ne sont demandées aux membres."))

    # Group list display settings
    category_field = models.CharField(
        verbose_name=_("Catégoriser par"),
        max_length=30,
        blank=True,
        help_text=_("Nom du champ pour catégoriser les groupes "
                    "dans la liste des groupes."))
    category_label = models.CharField(
        verbose_name=_("Label des catégories"),
        max_length=100,
        blank=True,
        help_text=("Utiliser la syntaxe Python pour formater le texte avec le "
                   "champ (cf https://docs.python.org/3/library/stdtypes.html#"
                   "str.format)"))

    class Meta:
        verbose_name = _("type de groupe")
        verbose_name_plural = _("types de groupes")

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("group:sub_index", kwargs={"type": self.slug})


class Group(models.Model, SlugModel):
    """Database of all groups, with different types: clubs, flatshares..."""

    # General data
    name = models.CharField(
        verbose_name=_("Nom du groupe"),
        unique=True,
        max_length=100)
    short_name = models.CharField(
        verbose_name=_("Nom raccourci"),
        max_length=20,
        blank=True,
        help_text=_("Ce nom sera affiché dans la liste des groupes."))
    members = models.ManyToManyField(
        to=Student,
        verbose_name=_("Membres du groupe"),
        related_name='groups',
        through='Membership')

    # Technical data
    group_type = models.ForeignKey(
        to=GroupType,
        verbose_name=_("Type de groupe"),
        on_delete=models.CASCADE)
    parent = models.ForeignKey(
        to='Group',
        verbose_name=_("Groupe parent"),
        blank=True,
        null=True,
        on_delete=models.CASCADE)
    order = models.IntegerField(
        verbose_name=_("Ordre"),
        default=0)
    year = models.IntegerField(
        verbose_name=_("Année du groupe"),
        null=True,
        blank=True,
        help_text=_("Pour les années scolaires, indiquez seulement la première "
                    "année (de septembre à décembre)"))
    slug = models.SlugField(max_length=40, unique=True, blank=True)
    archived = models.BooleanField(
        verbose_name=_("Groupe archivé"),
        default=False,
        help_text=("Un groupe archivé ne peut plus avoir de nouveaux membres "
                   "et est masqué des résultats par défaut."))

    # Permissions
    private = models.BooleanField(
        verbose_name=_("Groupe privé"),
        default=False,
        help_text=_("Un groupe privé n'est visible que par les membres du "
                    "groupe."))
    public = models.BooleanField(
        verbose_name=_("Groupe public"),
        default=False,
        help_text=_("Si coché, la page du groupe sera accessible publiquement, "
                    "y compris à des utilisateurs non-connectés. Les membres, "
                    "évènements et posts restent toutefois masqués."))
    anyone_can_join = models.BooleanField(
        verbose_name=_("Adhésion libre"),
        default=True,
        help_text=_("Affiche le bouton 'Devenir membre' pour tout le monde. "
                    "Si décoché, seuls les admins pourront ajouter de nouveaux "
                    "membres."))

    # Profile
    summary = models.CharField(
        verbose_name=_("Résumé"),
        max_length=500,
        blank=True)
    description = CKEditor5Field(
        verbose_name=_("Description du groupe"),
        blank=True)
    icon = models.ImageField(
        verbose_name=_("Logo du groupe"),
        blank=True,
        null=True,
        upload_to=path_and_rename_group,
        help_text=_("Votre logo sera affiché au format 306x306 pixels."))
    banner = models.ImageField(
        verbose_name=_("Bannière"),
        blank=True,
        null=True,
        upload_to=path_and_rename_group_banniere,
        help_text=_("Votre bannière sera affichée au format 1320x492 pixels."))
    video1 = models.URLField(
        verbose_name=_("Lien vidéo 1"), max_length=200, null=True, blank=True)
    video2 = models.URLField(
        verbose_name=_("Lien vidéo 2"), max_length=200, null=True, blank=True)
    social_links = models.ManyToManyField(
        to=SocialLink,
        verbose_name=_("Réseaux Sociaux"),
        related_name='+')

    # Map data
    place = models.ForeignKey(
        to=Place,
        verbose_name=_("Lieu lié au groupe"),
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

    @property
    def scholar_year(self) -> str:
        """Returns the year of the group in scholar year format, i.e. with
        the following year.

        Returns
        -------
        str
            The scholar year of the group, or an empty string if there is no
            year.

        Example
        -------
        >>> group.year = 2019
        >>> group.scholar_year
        '2019-2020'
        """

        if self.year:
            return f"{self.year}-{self.year+1}"
        else:
            return ""

    @property
    def prefixed_slug(self) -> str:
        """Get the slug prefixed by "group"

        Returns
        -------
        str
            The slug prefixed
        """
        return f"group--{self.slug}"

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
            and self.membership_set.get(student=user.student).admin
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
    admin = models.BooleanField(_("Admin"), default=False)
    summary = models.CharField(
        verbose_name=_("Résumé"),
        max_length=50,
        blank=True)
    description = models.TextField(
        verbose_name=_("Description"),
        blank=True)
    admin_request = models.BooleanField(
        _("A demandé à devenir admin"), default=False)
    admin_request_messsage = models.TextField(
        _("Raison de la demande à devenir admin"), blank=True)
    order = models.IntegerField(_("Ordre"), default=0)
    begin_date = models.DateField(
        verbose_name=_("Date de début"),
        default=today,
        blank=True,
        null=True)
    end_date = models.DateField(
        verbose_name=_("Date de fin"),
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
        if self.group.group_type.is_year_group:
            self.begin_date = timezone.date(self.group.year, 8, 1)
            self.end_date = timezone.date(self.group.year + 1, 7, 31)
        # if member becomes admin, remove the admin request
        if self.admin and self.admin_request:
            self.admin_request = False
            self.admin_request_messsage = ""
        super(Membership, self).save(*args, **kwargs)

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
