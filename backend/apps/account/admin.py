from django.conf import settings
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.contrib.sites.shortcuts import get_current_site
from django.core import mail
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _

from .models import IdRegistration, TemporaryAccessRequest


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


@admin.register(IdRegistration)
class IdRegistrationAdmin(admin.ModelAdmin):
    list_display = ["id"]


@admin.register(TemporaryAccessRequest)
class TemporaryAccessRequestAdmin(admin.ModelAdmin):
    actions = ["send_reminder"]
    list_display = ["user"]

    @admin.action(description="Send reminder to upgrade account.")
    def send_reminder(self, request, queryset):
        connection = mail.get_connection()
        current_site = get_current_site(request)
        mails = []
        for temp_access_request in queryset:
            temp_access_request: TemporaryAccessRequest
            email_html = render_to_string(
                "account/mail/reminder_upgrade.html",
                context={
                    "tempAccess": temp_access_request.user,
                    "deadline": settings.TEMPORARY_ACCOUNTS_DATE_LIMIT,
                    "domain": current_site.domain,
                },
            )
            email = mail.EmailMultiAlternatives(
                subject="[Nantral Platform] Votre compte expire bientôt !",
                body=email_html,
                to=[temp_access_request.user.email],
            )
            email.attach_alternative(content=email_html, mimetype="text/html")
            mails.append(email)
        connection.send_messages(mails)


@admin.register(get_user_model())
class CustomUserAdmin(UserAdmin):
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
                    "is_email_valid",
                    "is_staff",
                    "is_superuser",
                    "invitation",
                    "groups",
                    "user_permissions",
                ),
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
    list_filter = (
        "is_staff",
        "is_superuser",
        "is_active",
        "groups",
        UppercaseEmailFilter,
        ECNantesDomainFilter,
        NoPasswordFilter,
    )
