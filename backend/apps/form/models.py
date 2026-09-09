import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.account.models import User


class FormSchema(models.Model):
    uuid = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    schema = models.JSONField()
    ui_schema = models.JSONField(blank=True, null=True)

    # Translations
    i18n_keys_en = models.JSONField(blank=True, null=True)
    i18n_keys_fr = models.JSONField(blank=True, null=True)

    # Permissions
    users = models.ManyToManyField(
        User, through="UserRole", related_name="form_schemas"
    )
    # TODO: Add controls for these parameters
    editable = models.BooleanField(
        default=True, verbose_name=_("Can editors edit the form")
    )
    public = models.BooleanField(
        default=False,
        verbose_name=_("Are people able to get the form with only the URL"),
    )
    # active = models.BooleanField(
    #     default=False, verbose_name=_("Are people allowed to answer the form")
    # )

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return f"/form/{self.uuid}/"

    def is_admin(self, user: User) -> bool:
        return (
            user.is_superuser
            or self.userrole_set.filter(
                user=user, role__in=["owner", "editor"]
            ).exists()
        )

    def can_view_answers(self, user: User) -> bool:
        return (
            user.is_superuser
            or self.userrole_set.filter(
                user=user, role__in=["owner", "editor", "answer_viewer"]
            ).exists()
        )

    def can_view_form(self, user: User) -> bool:
        return (
            self.public
            or user.is_superuser
            or self.userrole_set.filter(user=user).exists()
        )


class UserRole(models.Model):
    ROLE_CHOICE = [
        ("owner", _("Owner")),
        ("editor", _("Editor")),
        ("answer_viewer", _("Answer Viewer")),
        ("form_viewer", _("Form Viewer")),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    form_schema = models.ForeignKey(FormSchema, on_delete=models.CASCADE)
    role = models.CharField(
        max_length=50,
        choices=ROLE_CHOICE,
    )

    class Meta:
        unique_together = ("user", "form_schema")


class FormAnswer(models.Model):
    uuid = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    form_schema = models.ForeignKey(FormSchema, on_delete=models.CASCADE)
    data = models.JSONField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("form_schema", "user")

    def __str__(self):
        return _("Answer to {} at {} by {}").format(
            self.form_schema.name, self.submitted_at, self.user.name
        )

    def get_absolute_url(self):
        return f"/form/{self.form_schema.uuid}/answer/{self.uuid}/"
