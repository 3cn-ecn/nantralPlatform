from typing import Any

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db.models import Count, F
from django.db.models.query import QuerySet
from django.http.request import HttpRequest
from django.template.response import TemplateResponse
from django.urls import URLPattern, path
from django.utils.translation import gettext_lazy as _

from apps.utils.send_email import send_mass_email

from .models import Email, InvitationLink, User


class UppercaseEmailFilter(admin.SimpleListFilter):
    title = "mail avec majuscules"
    parameter_name = "uppercase_email"

    def lookups(self, request, model_admin):
        return (("has_uppercase", "A des majuscules"),)

    def queryset(self, request, queryset):
        if self.value() == "has_uppercase":
            return queryset.filter(emails__email__regex=r"[A-Z]")


class ECNantesDomainFilter(admin.SimpleListFilter):
    title = _("Your Centrale Nantes email")
    parameter_name = "ecnantes_domain"

    def lookups(self, request, model_admin):
        return (
            ("with_domain", "ec-nantes.fr"),
            ("without_domain", _("Other providers")),
        )

    def queryset(self, request, queryset):
        if self.value() == "with_domain":
            return queryset.filter(
                emails__email__regex=r"@(\w+\.)?ec-nantes\.fr$"
            )
        if self.value() == "without_domain":
            return queryset.exclude(
                emails__email__regex=r"@(\w+\.)?ec-nantes\.fr$"
            )


class NoPasswordFilter(admin.SimpleListFilter):
    title = _("Empty passsword")
    parameter_name = "no_password"

    def lookups(self, request, model_admin):
        return (("no_password", _("Empty passsword")),)

    def queryset(self, request, queryset):
        if self.value() == "no_password":
            return queryset.filter(password="")


class IsEmailValidFilter(admin.SimpleListFilter):
    title = _("Verified email?")
    parameter_name = "is_email_valid"

    def lookups(self, request, model_admin):
        return (
            ("email_valid", _("Yes")),
            ("email_invalid", _("No")),
        )

    def queryset(self, request, queryset):
        if self.value() == "email_valid":
            return queryset.filter(
                emails__is_valid=True, emails__email__iexact=F("email")
            )
        if self.value() == "email_invalid":
            return queryset.filter(
                emails__is_valid=False, emails__email__iexact=F("email")
            )


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


@admin.register(Email)
class EmailAdmin(admin.ModelAdmin):
    list_display = ["email", "user", "is_valid", "is_ecn_email", "is_visible"]
    list_filter = ["is_valid", UppercaseEmailFilter, ECNantesDomainFilter]
    list_editable = ["is_valid", "is_visible"]
    fields = ["email", "user", "is_valid", "is_ecn_email", "is_visible"]
    readonly_fields = ["is_ecn_email"]
    search_fields = ["email", "user__first_name", "user__last_name"]
    ordering = ["email"]


class EmailInline(admin.TabularInline):
    model = Email
    extra = 1
    fields = ["email", "is_valid", "is_ecn_email", "is_visible"]
    readonly_fields = ["is_ecn_email"]
    min_num = 1


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    actions = ["send_reminder"]
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (
            _("Personal info"),
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
            _("Account Validation"),
            {
                "fields": (
                    "is_email_valid",
                    "invitation",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
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
    readonly_fields = (
        "date_joined",
        "last_login",
        "is_email_valid",
    )
    inlines = (EmailInline,)
    search_fields = ("username", "first_name", "last_name", "emails__email")

    list_filter = (
        "is_staff",
        "is_superuser",
        "is_active",
        "group_set",
        "invitation",
        IsEmailValidFilter,
        UppercaseEmailFilter,
        ECNantesDomainFilter,
        NoPasswordFilter,
    )

    def get_urls(self) -> list[URLPattern]:
        urls = super().get_urls()
        custom_urls = [
            path(
                "metrics/",
                self.admin_site.admin_view(self.metrics_view),
                name="student-metrics",
            ),
        ]
        return custom_urls + urls

    def metrics_view(self, request):
        context = dict(
            self.admin_site.each_context(request=request),
            promos=User.objects.all()
            .values("promo")
            .annotate(count=Count("promo"))
            .order_by(),
            nb_students=User.objects.all().count(),
        )
        return TemplateResponse(
            request=request,
            template="admin/student/metrics.html",
            context=context,
        )

    def get_form(self, request, obj=None, change=False, **kwargs):
        form = super().get_form(request, obj=obj, change=change, **kwargs)
        form.base_fields["username"].help_text = _(
            "NEVER UPDATE THE USERNAME. Doing this will cause the users to loose access to their matrix account"
        )
        return form

    @admin.action(description="Send reminder to upgrade account.")
    def send_reminder(self, request, queryset: list[User]):
        upgrade_link = request.build_absolute_uri(
            "/account/email/",
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
                user.email.email
                for user in queryset
                if user.invitation is not None
                and not user.has_valid_ecn_email()
            ],
        )
