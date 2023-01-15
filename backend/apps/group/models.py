from datetime import timedelta, date

from django.conf import settings
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
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
    """Returns the date of today."""
    return timezone.now().date()


def one_year_later() -> date:
    """Returns the day of today but one year later."""
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

    # Members settings
    is_year_group = models.BooleanField(
        _("Groupes annuels"),
        default=False,
        help_text=_("Les groupes sont liés à une année scolaire. "
                    "Aucunes dates ne sont demandées aux membres."))
    private_by_default = models.BooleanField(
        _("Privés par défaut"),
        default=False,
        help_text=_("Les nouveaux groupes créés sont privés par défaut."))

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
    category_label_default = models.CharField(
        verbose_name=_("Label de la catégorie par défaut"),
        max_length=30,
        blank=True)
    extra_parents = models.ManyToManyField(
        to='Group',
        verbose_name=_("Parents supplémentaires"),
        related_name='+',
        blank=True,
        help_text=_("Les enfants de ces groupes seront affichés dans la "
                    "liste des groupes."))

    class Meta:
        verbose_name = _("type de groupe")
        verbose_name_plural = _("types de groupes")

    def __str__(self) -> str:
        return self.name

    def get_absolute_url(self) -> str:
        """Get the url of the object."""
        return reverse('group:sub_index', kwargs={'type': self.slug})

    def get_admin_url(self) -> str:
        """Get the url to edit the object in the admin interface."""
        return reverse('admin:group_grouptype_change',
                       kwargs={'object_id': self.pk})


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
        through='Membership',
        blank=True)
    subscribers = models.ManyToManyField(
        to=Student,
        verbose_name=_("Abonnés"),
        related_name='subscriptions',
        blank=True)

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
    restrict_membership = models.BooleanField(
        verbose_name=_("Adhésion restreinte"),
        default=False,
        help_text=_("Masque le bouton 'Devenir membre'. Seuls les admins "
                    "pourront ajouter de nouveaux membres."))

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
        related_name='+',
        blank=True)

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

    class Meta:
        verbose_name = "groupe"

    def __str__(self) -> str:
        return self.short_name

    def clean(self) -> None:
        """Method to test if the object is valid (no incompatibility between
        fields."""
        if self.group_type.is_year_group and self.year is None:
            raise ValidationError(_("You must provides a year."))
        if self.public and self.private:
            raise ValidationError(_("You cannot set both 'public' and "
                                    "'private' properties to True."))

    def save(self, *args, **kwargs) -> None:
        """Save an instance of the model in the database."""
        # fill default values
        if not self.short_name:
            self.short_name = self.name
        if self.pk is None:
            self.created_by = self.last_modified_by
        if self.pk is None and self.group_type.private_by_default:
            self.private = True
        # create the slug
        self.set_slug(self.short_name, max_length=40)
        # compress images
        self.icon = compress_model_image(
            self, 'icon', size=(500, 500), contains=True)
        self.banner = compress_model_image(
            self, 'banner', size=(1320, 492), contains=False)
        # save the instance
        super(Group, self).save(*args, **kwargs)

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

        return (self.is_member(user)
                and self.membership_set.get(student=user.student).admin
                or user.is_superuser)

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

        return (user.is_authenticated
                and hasattr(user, 'student')
                and self.members.contains(user.student))

    def get_category(self) -> str:
        """Get the category label for list display.

        Returns
        -------
        str
            The formatted label of the category of the group.
        """
        field = self.group_type.category_field
        value_field = getattr(self, field)
        if value_field:
            return self.group_type.category_label.format(value_field)
        else:
            return self.group_type.category_label_default

    def get_absolute_url(self) -> str:
        """Get the url of the object."""
        return reverse('group:detail', kwargs={'slug': self.slug})

    def get_admin_url(self) -> str:
        """Get the url to edit the object in the admin interface."""
        return reverse('admin:group_group_change',
                       kwargs={'object_id': self.pk})


class Membership(models.Model):
    """A class for memberships of each group."""

    student = models.ForeignKey(to=Student, on_delete=models.CASCADE)
    group = models.ForeignKey(to=Group, on_delete=models.CASCADE)
    summary = models.CharField(
        verbose_name=_("Résumé"),
        max_length=50,
        blank=True)
    description = models.TextField(
        verbose_name=_("Description"),
        blank=True)
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
    order = models.IntegerField(_("Ordre"), default=0)
    admin = models.BooleanField(_("Admin"), default=False)
    admin_request = models.BooleanField(
        _("A demandé à devenir admin"), default=False)
    admin_request_messsage = models.TextField(
        _("Raison de la demande à devenir admin"), blank=True)

    class Meta:
        unique_together = ('student', 'group')
        ordering = ['group', 'order', 'student']
        verbose_name = "membre"

    def __str__(self) -> str:
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
