from typing import Any

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db.models.query import QuerySet
from django.http.request import HttpRequest
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from apps.student.admin import StudentInline
from apps.utils.send_email import send_mass_email

from .models import InvitationLink, User


class UppercaseEmailFilter(admin.SimpleListFilter):
    title = "mail avec majuscules"
    parameter_name = "uppercase_email"

    def lookups(self, request, model_admin):
        return (("has_uppercase", "A des majuscules"),)

    def queryset(self, request, queryset):
        if self.value() == "has_uppercase":
            return queryset.filter(email__regex=r"[A-Z]")


class ECNantesDomainFilter(admin.SimpleListFilter):
    title = _("mail Centrale Nantes")
    parameter_name = "ecnantes_domain"

    def lookups(self, request, model_admin):
        return (
            ("with_domain", "ec-nantes.fr"),
            ("without_domain", "autres hébergeurs"),
        )

    def queryset(self, request, queryset):
        if self.value() == "with_domain":
            return queryset.filter(email__regex=r"@(\w+\.)?ec-nantes\.fr$")
        if self.value() == "without_domain":
            return queryset.exclude(email__regex=r"@(\w+\.)?ec-nantes\.fr$")


class NoPasswordFilter(admin.SimpleListFilter):
    title = "mot de passe vide"
    parameter_name = "no_password"

    def lookups(self, request, model_admin):
        return (("no_password", "Mot de passe vide"),)

    def queryset(self, request, queryset):
        if self.value() == "no_password":
            return queryset.filter(password="")  # noqa: S106


@admin.register(InvitationLink)
class IdRegistrationAdmin(admin.ModelAdmin):
    list_display = ["id", "description", "expires_at"]
    readonly_fields = ("url",)

    def get_queryset(self, request: HttpRequest) -> QuerySet[Any]:
        self.request = request  # get access to the request object
        return super().get_queryset(request)

    def url(self, obj: InvitationLink):
        absolute_uri = obj.get_absolute_url()
        return self.request.build_absolute_uri(absolute_uri)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    actions = ["send_reminder"]
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (
            _("Info personnelles"),
            {"fields": ("first_name", "last_name", "email")},
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (
            _("Validation du compte"),
            {
                "fields": (
                    "is_email_valid",
                    "email_next",
                    "invitation",
                )
            },
        ),
        (_("Dates Importantes"), {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
    readonly_fields = ("date_joined", "last_login")
    inlines = (StudentInline,)

    list_filter = (
        "is_staff",
        "is_superuser",
        "is_active",
        "groups",
        "invitation",
        UppercaseEmailFilter,
        ECNantesDomainFilter,
        NoPasswordFilter,
    )

    @admin.action(description="Send reminder to upgrade account.")
    def send_reminder(self, request, queryset: list[User]):
        upgrade_link = request.build_absolute_uri(
            reverse("account:upgrade-permanent")
        )
        send_mass_email(
            template_name="reminder-upgrade",
            subject="[Nantral Platform] Votre compte expire bientôt !",
            context_list=[
                {
                    "first_name": user.first_name,
                    "deadline": user.invitation.expires_at,
                    "change_email_link": upgrade_link,
                }
                for user in queryset
                if user.invitation is not None
            ],
            recipient_list=[
                user.email for user in queryset if user.invitation is not None
            ],
        )
