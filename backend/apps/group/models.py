from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _

from django_ckeditor_5.fields import CKEditor5Field
from simple_history.models import HistoricalRecords

from apps.account.models import User
from apps.sociallink.models import SocialLink
from apps.utils.fields.image_field import CustomImageField
from apps.utils.slug import SlugModel


class GroupType(models.Model):
    """The type of a group.

    Can be flat-shares, clubs, formations, BDX lists, etc.
    """

    # Type infos
    name = models.CharField(
        verbose_name=_("Type name"),
        unique=True,
        max_length=30,
    )
    slug = models.SlugField(primary_key=True, max_length=10)
    icon = CustomImageField(
        verbose_name=_("Icon"),
        blank=True,
        null=True,
        size=(306, 306),
        crop=True,
        name_from_field="slug",
    )
    is_map = models.BooleanField(verbose_name=_("Is a location"), default=False)

    # Members settings
    no_membership_dates = models.BooleanField(
        _("No dates for memberships"),
        default=False,
        help_text=_("Do not ask dates for members."),
    )
    private_by_default = models.BooleanField(
        _("Private by default"),
        default=False,
        help_text=_("New groups are private by default."),
    )
    priority = models.IntegerField(verbose_name=_("Priority"), default=0)

    # Group list display settings
    extra_parents = models.ManyToManyField(
        to="Group",
        verbose_name=_("Additional parent groups"),
        related_name="+",
        blank=True,
        help_text=_(
            "Children groups of these groups will be displayed in the "
            "list of all groups.",
        ),
    )
    sort_fields = models.CharField(
        verbose_name=_("Sort Fields"),
        max_length=100,
        default="-priority,short_name",
        help_text=_(
            "Fields used to sort groups in the list, separated by ',' "
            "and without spaces. If categories are defined, you must "
            "also reflect them here.",
        ),
    )
    category_expr = models.CharField(
        verbose_name=_("Category expression"),
        max_length=200,
        default="''",
        help_text=_("A python expression to get the category label."),
    )
    sub_category_expr = models.CharField(
        verbose_name=_("Sub category expression"),
        max_length=200,
        default="''",
        help_text=_("A python expression to get the sub-category label."),
    )
    hide_no_active_members = models.BooleanField(
        verbose_name=_("Hide groups without active members"),
        default=False,
        help_text=_("Hide groups where all 'end_date' from members are past."),
    )

    # Permissions
    can_create = models.BooleanField(
        verbose_name=_("Everyone can create new group"),
        default=False,
    )
    can_have_parent = models.BooleanField(default=True)

    class Meta:
        verbose_name = _("group type")
        verbose_name_plural = _("group types")

    def __str__(self) -> str:
        return self.name

    def get_absolute_url(self) -> str:
        """Get the url of the object."""
        return f"/group/{self.slug}/"

    def delete(self, *args, **kwargs) -> None:
        self.icon.delete(save=False)
        super().delete(*args, **kwargs)


class Label(models.Model):
    name = models.CharField(_("Label Name"), max_length=30)
    priority = models.IntegerField(_("Priority"), default=0)
    group_type = models.ForeignKey(
        to=GroupType,
        verbose_name=_("Type of group"),
        on_delete=models.CASCADE,
    )

    def __str__(self) -> str:
        return self.name


class Thematic(models.Model):
    identifier = models.AutoField(unique=True, primary_key=True)
    name = models.CharField(_("Name"), max_length=30, unique=True)
    priority = models.IntegerField(_("Priority"), default=0)
    visible = models.BooleanField(default=True)
    public = models.BooleanField(default=True)

    class Meta:
        verbose_name = _("Thematic")
        verbose_name_plural = _("Thematics")

    def __str__(self) -> str:
        return self.name


class Tag(models.Model):
    name = models.CharField(_("Tag Name"), max_length=50)
    group_type = models.ForeignKey(
        to=GroupType,
        verbose_name=_("Type of group"),
        on_delete=models.CASCADE,
    )

    def __str__(self) -> str:
        return self.name


class Group(models.Model, SlugModel):
    """Database of all groups, with different types: clubs, flat-shares..."""

    # General data
    name = models.CharField(verbose_name=_("Name"), unique=True, max_length=100)
    short_name = models.CharField(
        verbose_name=_("Short name"),
        max_length=100,
        blank=True,
        help_text=_("This name will be used in the list of groups."),
    )
    members = models.ManyToManyField(
        to=User,
        verbose_name=_("Members"),
        related_name="group_set",
        through="Membership",
        blank=True,
    )
    subscribers = models.ManyToManyField(
        to=User,
        verbose_name=_("Subscribers"),
        related_name="subscriptions",
        blank=True,
    )

    # Technical data
    group_type = models.ForeignKey(
        to=GroupType,
        verbose_name=_("Type of group"),
        on_delete=models.CASCADE,
    )
    label = models.ForeignKey(
        to=Label,
        verbose_name=_("Label"),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    tags = models.ManyToManyField(to=Tag, verbose_name=_("Tags"), blank=True)
    thematic = models.ForeignKey(
        to=Thematic, on_delete=models.CASCADE, null=True, blank=True
    )
    parent = models.ForeignKey(
        to="self",
        verbose_name=_("Parent group"),
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        related_name="children",
    )
    children_label = models.CharField(
        verbose_name=_("Children groups label"),
        max_length=50,
        default="Sous-groupes",
    )
    lock_memberships = models.BooleanField(
        _("Lock memberships"),
        default=False,
        help_text=_("Users cannot add themselves as members of this group."),
    )
    priority = models.IntegerField(verbose_name=_("Priority"), default=0)
    creation_year = models.IntegerField(
        verbose_name=_("Year of creation"),
        null=True,
        blank=True,
        help_text=_("The year the group has been created."),
    )
    slug = models.SlugField(max_length=40, unique=True, blank=True)
    archived = models.BooleanField(
        verbose_name=_("Archived group"),
        default=False,
        help_text=_(
            "An archived group cannot have new members and is hidden "
            "from the displayed list.",
        ),
    )

    # Permissions
    private = models.BooleanField(
        verbose_name=_("Private group"),
        default=False,
        help_text=_("A private group is only visible by group members."),
    )
    public = models.BooleanField(
        verbose_name=_("Public group"),
        default=False,
        help_text=_(
            "If ticked, the group page can be seen by everyone, "
            "including non-authenticated users. Members, events and "
            "posts still however hidden.",
        ),
    )
    can_pin = models.BooleanField(
        verbose_name=_("Can pin"),
        default=False,
        help_text=_("Admin members of this group can pin their posts"),
    )

    # Profile
    summary = models.CharField(
        verbose_name=_("Summary"),
        max_length=500,
        blank=True,
    )
    description = CKEditor5Field(verbose_name=_("Description"), blank=True)
    meeting_place = models.CharField(
        verbose_name=_("Meeting place"),
        max_length=50,
        blank=True,
    )
    meeting_hour = models.CharField(
        verbose_name=_("Meeting hours"),
        max_length=50,
        blank=True,
    )
    icon = CustomImageField(
        verbose_name=_("Profile picture"),
        blank=True,
        null=True,
        help_text=_(
            "Image with a ratio of 1:1 (recommended minimum size: 500x500)"
        ),
        size=(500, 500),
        crop=False,
        name_from_field="name",
        delete_on_save=False,
    )
    banner = CustomImageField(
        verbose_name=_("Banner"),
        blank=True,
        null=True,
        help_text=_(
            "Image with 3:1 ratio (recommended minimum size: 1200x400)"
        ),
        size=(1200, 400),
        name_from_field="name",
        delete_on_save=False,
    )
    video1 = models.URLField(
        verbose_name=_("Video link 1"),
        max_length=200,
        blank=True,
    )
    video2 = models.URLField(
        verbose_name=_("Video link 2"),
        max_length=200,
        blank=True,
    )
    social_links = models.ManyToManyField(
        to=SocialLink,
        verbose_name=_("Social networks"),
        related_name="group_set",
        blank=True,
    )

    # Map infos
    address = models.CharField(
        max_length=250, verbose_name=_("Address"), blank=True, default=""
    )
    latitude = models.FloatField(
        verbose_name=_("Latitude"), null=True, blank=True, default=47.2186371
    )
    longitude = models.FloatField(
        verbose_name=_("Longitude"), null=True, blank=True, default=-1.5541362
    )

    # Field to handle history of the updates to the group
    history = HistoricalRecords(
        excluded_fields=(
            "short_name",
            "members",
            "subscribers",
            "group_type",
            "label",
            "tags",
            "parent",
            "children_label",
            "lock_memberships",
            "priority",
            "creation_year",
            "slug",
            "archived",
            "private",
            "public",
            "can_pin",
            "meeting_place",
            "meeting_hour",
            "social_links",
            "address",
            "latitude",
            "longitude",
            "summary_fr",
            "summary_en",
            "description_fr",
            "description_en",
            "thematic",
        ),
        related_name="versions",
    )

    class Meta:
        verbose_name = "groupe"

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs) -> None:
        """Save an instance of the model in the database."""
        # fill default values
        if not self.short_name:
            self.short_name = self.name
        if self.pk is None and self.group_type.private_by_default:
            self.private = True
        # create the slug
        self.set_slug(self.short_name, max_length=40)
        # save the instance
        super().save(*args, **kwargs)

    def get_absolute_url(self) -> str:
        """Get the url of the object."""
        return f"/group/@{self.slug}"

    def clean(self) -> None:
        """Test if the object is valid (no incompatibility between fields)."""
        # If the group type has a map, check if map fields are not empty
        if self.group_type.is_map and (
            self.address is None
            or self.latitude is None
            or self.longitude is None
        ):
            raise ValidationError(
                f"Address and latitude are required for group type {self.group_type}."
            )
        if self.public and self.private:
            raise ValidationError(
                _(
                    "You cannot set both 'public' and "
                    "'private' properties to True.",
                ),
            )

    @property
    def created_at(self):
        return self.history.earliest().history_date

    @property
    def created_by(self):
        return self.history.earliest().history_user

    @property
    def updated_at(self):
        return self.history.latest().history_date

    @property
    def updated_by(self):
        return self.history.latest().history_user

    @property
    def scholar_year(self) -> str:
        """Returns the year of the group in scholar year format.

        Returns:
        -------
        str
            The scholar year of the group, or an empty string if there is no
            year.

        Example:
        -------
        >>> group = Group.objects.all().first()
        >>> group.year = 2019
        >>> group.scholar_year
        '2019-2020'

        """
        if self.creation_year:
            return f"{self.creation_year}-{self.creation_year + 1}"
        else:
            return ""

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
            user.is_superuser
            or (
                self.is_member(user)
                and self.membership_set.get(user=user).admin
            )
            or (self.parent is not None and self.parent.is_admin(user))
        )

    def is_subscribed(self, user: User) -> bool:
        """Check if a user is subscribed to this group.

        Parameters
        ----------
        user : User
            The user to check for.

        Returns
        -------
        bool
            True if the user is a member of this group.

        """
        return user.is_authenticated and self.subscribers.contains(user)

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
        return user.is_authenticated and self.members.contains(user)

    def _eval_as_str(self, expr: str) -> str | None:
        """Evaluate an expression containing with this group as a context variable
        and returns the result as a string

        Parameters
        ----------
        expr : The expression to evaluate

        Returns
        -------
        None if the result is None else a string representing the result
        """
        res = eval(expr, {"group": self})  # noqa: S307

        if res is None:
            return None

        return str(res)

    def get_category(self) -> str:
        """Get the category label for list display.

        Returns
        -------
        str
            The formatted label of the category of the group.

        """
        return self._eval_as_str(self.group_type.category_expr)

    def get_sub_category(self) -> str:
        """Get the sub category label for list display.

        Returns
        -------
        str
            The formatted label of the category of the group.

        """
        return self._eval_as_str(self.group_type.sub_category_expr)


class Membership(models.Model):
    """A class for memberships of each group."""

    user = models.ForeignKey(
        to=User,
        on_delete=models.CASCADE,
        related_name="membership_set",
    )
    group = models.ForeignKey(
        to=Group,
        on_delete=models.CASCADE,
        related_name="membership_set",
    )
    summary = models.CharField(
        verbose_name=_("Summary"),
        max_length=50,
        blank=True,
    )
    description = models.TextField(verbose_name=_("Description"), blank=True)
    begin_date = models.DateField(verbose_name=_("Begin date"), null=True)
    end_date = models.DateField(verbose_name=_("End date"), null=True)
    priority = models.IntegerField(_("Priority"), default=0)
    admin = models.BooleanField(_("Admin"), default=False)
    admin_request = models.BooleanField(
        _("Asked to become admin"),
        default=False,
    )
    admin_request_message = models.TextField(_("Request message"), blank=True)

    class Meta:
        unique_together = ("user", "group")
        ordering = ["group", "-priority", "user"]
        verbose_name = "membre"

    def __str__(self) -> str:
        return str(self.user)

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
        super().save(*args, **kwargs)
