from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.template.loader import render_to_string
from django.urls.base import reverse
from django.utils.translation import gettext_lazy as _

from discord_webhook import DiscordEmbed, DiscordWebhook
from django_ckeditor_5.fields import CKEditor5Field

from apps.sociallink.models import SocialLink
from apps.student.models import Student
from apps.utils.compress import compress_model_image
from apps.utils.slug import SlugModel
from apps.utils.upload import PathAndRename
from django.contrib.auth import get_user_model

path_and_rename_group = PathAndRename('groups/logo')
path_and_rename_group_banner = PathAndRename('groups/banniere')
path_and_rename_group_type = PathAndRename('groups/types')

User = get_user_model()


class GroupType(models.Model):
    """
    The type of a group: club, flatshare, etc... with all the group type
    settings.
    """

    # Type infos
    name = models.CharField(
        verbose_name=_("Type name"),
        unique=True,
        max_length=30)
    slug = models.SlugField(
        primary_key=True,
        max_length=10)
    icon = models.ImageField(
        verbose_name=_("Icon"),
        blank=True,
        null=True,
        upload_to=path_and_rename_group_type)

    # Members settings
    no_membership_dates = models.BooleanField(
        _("No dates for memberships"),
        default=False,
        help_text=_("Do not ask dates for members."))
    private_by_default = models.BooleanField(
        _("Private by default"),
        default=False,
        help_text=_("New groups are private by default."))

    # Group list display settings
    extra_parents = models.ManyToManyField(
        to='Group',
        verbose_name=_("Additional parent groups"),
        related_name='+',
        blank=True,
        help_text=_("Children groups of these groups will be displayed in the "
                    "list of all groups."))
    sort_fields = models.CharField(
        verbose_name=_("Sort Fields"),
        max_length=100,
        default='-priority,short_name',
        help_text=_("Fields used to sort groups in the list, separated by ',' "
                    "and without spaces. If categories are defined, you must "
                    "also reflect them here."))
    category_expr = models.CharField(
        verbose_name=_("Category expression"),
        max_length=200,
        default="''",
        help_text=_("A python expression to get the category label."))
    sub_category_expr = models.CharField(
        verbose_name=_("Sub category expression"),
        max_length=200,
        default="''",
        help_text=_("A python expression to get the sub-category label."))
    hide_no_active_members = models.BooleanField(
        verbose_name=_("Hide groups without active members"),
        default=False,
        help_text=_("Hide groups where all 'end_date' from members are past."))

    # Permissions
    can_create = models.BooleanField(
        verbose_name=_("Everyone can create new group"),
        default=False)

    class Meta:
        verbose_name = _("group type")
        verbose_name_plural = _("group types")

    def __str__(self) -> str:
        return self.name

    def get_absolute_url(self) -> str:
        """Get the url of the object."""
        return reverse('group:sub_index', kwargs={'type': self.slug})


class Label(models.Model):
    name = models.CharField(_("Label Name"), max_length=30)
    priority = models.IntegerField(_("Priority"), default=0)
    group_type = models.ForeignKey(
        to=GroupType,
        verbose_name=_("Type of group"),
        on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.name


class Tag(models.Model):
    name = models.CharField(_("Tag Name"), max_length=50)
    group_type = models.ForeignKey(
        to=GroupType,
        verbose_name=_("Type of group"),
        on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.name


class Group(models.Model, SlugModel):
    """Database of all groups, with different types: clubs, flatshares..."""

    # General data
    name = models.CharField(
        verbose_name=_("Name"),
        unique=True,
        max_length=100)
    short_name = models.CharField(
        verbose_name=_("Short name"),
        max_length=100,
        blank=True,
        help_text=_("This name will be used in the list of groups."))
    members = models.ManyToManyField(
        to=Student,
        verbose_name=_("Members"),
        related_name='groups',
        through='Membership',
        blank=True)
    subscribers = models.ManyToManyField(
        to=Student,
        verbose_name=_("Subscribers"),
        related_name='subscriptions',
        blank=True)

    # Technical data
    group_type = models.ForeignKey(
        to=GroupType,
        verbose_name=_("Type of group"),
        on_delete=models.CASCADE)
    label = models.ForeignKey(
        to=Label,
        verbose_name=_("Label"),
        on_delete=models.SET_NULL,
        null=True,
        blank=True)
    tags = models.ManyToManyField(
        to=Tag,
        verbose_name=_("Tags"),
        blank=True)
    parent = models.ForeignKey(
        to='self',
        verbose_name=_("Parent group"),
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        related_name='children')
    children_label = models.CharField(
        verbose_name=_("Children groups label"),
        max_length=50,
        default="Sous-groupes")
    lock_memberships = models.BooleanField(
        _("Lock memberships"),
        default=False,
        help_text=_("Users cannot add themselves as members of this group."))
    priority = models.IntegerField(
        verbose_name=_("Priority"),
        default=0)
    creation_year = models.IntegerField(
        verbose_name=_("Year of creation"),
        null=True,
        blank=True,
        help_text=_("The year the group has been created."))
    slug = models.SlugField(max_length=40, unique=True, blank=True)
    archived = models.BooleanField(
        verbose_name=_("Archived group"),
        default=False,
        help_text=_("An archived group cannot have new members and is hidden "
                    "from the displayed list."))

    # Permissions
    private = models.BooleanField(
        verbose_name=_("Private group"),
        default=False,
        help_text=_("A private group is only visible by group members."))
    public = models.BooleanField(
        verbose_name=_("Public group"),
        default=False,
        help_text=_("If ticked, the group page can be seen by everyone, "
                    "including non-authenticated users. Members, events and "
                    "posts still however hidden."))
    can_pin = models.BooleanField(
        verbose_name=_("Can pin"),
        default=False,
        help_text=_("Admin members of this group can pin their posts"))

    # Profile
    summary = models.CharField(
        verbose_name=_("Summary"),
        max_length=500,
        blank=True)
    description = CKEditor5Field(
        verbose_name=_("Description"),
        blank=True)
    meeting_place = models.CharField(
        verbose_name=_("Meeting place"),
        max_length=50,
        blank=True)
    meeting_hour = models.CharField(
        verbose_name=_("Meeting hours"),
        max_length=50,
        blank=True)
    icon = models.ImageField(
        verbose_name=_("Icon"),
        blank=True,
        null=True,
        upload_to=path_and_rename_group,
        help_text=_("Your icon will be displayed at 306x306 pixels."))
    banner = models.ImageField(
        verbose_name=_("Banner"),
        blank=True,
        null=True,
        upload_to=path_and_rename_group_banner,
        help_text=_("Your banner will be displayed at 1320x492 pixels."))
    video1 = models.URLField(
        verbose_name=_("Video link 1"), max_length=200, null=True, blank=True)
    video2 = models.URLField(
        verbose_name=_("Video link 2"), max_length=200, null=True, blank=True)
    social_links = models.ManyToManyField(
        to=SocialLink,
        verbose_name=_("Social networks"),
        related_name='+',
        blank=True)

    # Log infos
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        Student, blank=True, null=True,
        on_delete=models.SET_NULL, related_name='+')
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
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

        if self.creation_year:
            return f"{self.creation_year}-{self.creation_year+1}"
        else:
            return ""

    class Meta:
        verbose_name = "groupe"

    def __str__(self) -> str:
        return self.short_name

    def clean(self) -> None:
        """Method to test if the object is valid (no incompatibility between
        fields."""
        if self.public and self.private:
            raise ValidationError(_("You cannot set both 'public' and "
                                    "'private' properties to True."))

    def save(self, *args, **kwargs) -> None:
        """Save an instance of the model in the database."""
        # fill default values
        if not self.short_name:
            self.short_name = self.name
        if self.pk is None:
            self.created_by = self.updated_by
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

        return (user.is_superuser
                or self.is_member(user)
                and self.membership_set.get(student=user.student).admin
                or self.parent is not None and self.parent.is_admin(user))

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
        return eval(self.group_type.category_expr, {'group': self})

    def get_sub_category(self) -> str:
        """Get the sub category label for list display.

        Returns
        -------
        str
            The formatted label of the category of the group.
        """
        return eval(self.group_type.sub_category_expr, {'group': self})

    def get_absolute_url(self) -> str:
        """Get the url of the object."""
        return f'/group/@{self.slug}'


class Membership(models.Model):
    """A class for memberships of each group."""

    student = models.ForeignKey(
        to=Student,
        on_delete=models.CASCADE,
        related_name='membership_set')
    group = models.ForeignKey(
        to=Group,
        on_delete=models.CASCADE,
        related_name='membership_set')
    summary = models.CharField(
        verbose_name=_("Summary"),
        max_length=50,
        blank=True)
    description = models.TextField(
        verbose_name=_("Description"),
        blank=True)
    begin_date = models.DateField(
        verbose_name=_("Begin date"),
        null=True)
    end_date = models.DateField(
        verbose_name=_("End date"),
        null=True)
    priority = models.IntegerField(_("Priority"), default=0)
    admin = models.BooleanField(_("Admin"), default=False)
    admin_request = models.BooleanField(
        _("Asked to become admin"), default=False)
    admin_request_messsage = models.TextField(
        _("Request message"), blank=True)

    class Meta:
        unique_together = ('student', 'group')
        ordering = ['group', '-priority', 'student']
        verbose_name = "membre"

    def __str__(self) -> str:
        return self.student.__str__()

    def save(self, *args, **kwargs) -> None:
        """Save the membership object."""
        # default dates for year groups
        if self.group.group_type.no_membership_dates:
            self.begin_date = None
            self.end_date = None
        # if member becomes admin, remove the admin request
        if self.admin and self.admin_request:
            self.admin_request = False
            self.admin_request_messsage = ""
        super(Membership, self).save(*args, **kwargs)

    def accept_admin_request(self) -> None:
        """Accept an admin request."""
        self.admin = True
        self.save()
        mail = render_to_string('group/mail/accept_admin_request.html', {
            'group': self.group,
            'user': self.student.user
        })
        self.student.user.email_user(
            subject=(_("Your admin request for %(group)s has been accepted.")
                     % {'group': self.group.name}),
            message=mail,
            html_message=mail)
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
        mail = render_to_string('group/mail/deny_admin_request.html', {
            'group': self.group,
            'user': self.student.user
        })
        self.student.user.email_user(
            subject=(_("Your admin request for %(group)s has been denied.")
                     % {'group': self.group.name}),
            message=mail,
            html_message=mail)
        webhook = DiscordWebhook(
            url=settings.DISCORD_ADMIN_MODERATION_WEBHOOK)
        embed = DiscordEmbed(
            title=(f'La demande de {self.student} pour rejoindre {self.group} '
                   'a été refusée.'),
            description="",
            color=00000)
        webhook.add_embed(embed)
        webhook.execute()
