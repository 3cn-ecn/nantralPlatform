from django.contrib import admin
from django.db.models import Count, Exists, OuterRef, Q
from django.urls import reverse
from django.utils import timezone
from django.utils.html import format_html

from simple_history.admin import SimpleHistoryAdmin

from .models import Group, GroupType, Label, Membership, Tag


class HasMembersFilter(admin.SimpleListFilter):
    title = "Members"
    parameter_name = "has_members"

    def lookups(self, request, model_admin):
        return [
            ("2", "With active members"),
            ("1", "No active members"),
            ("0", "No members"),
        ]

    def queryset(self, request, queryset):
        today = timezone.localdate()
        any_qs = Membership.objects.filter(group=OuterRef("pk"))
        active_qs = any_qs.filter(
            Q(end_date__isnull=True) | Q(end_date__gte=today)
        )
        if self.value() == "2":
            return queryset.filter(Exists(active_qs))
        if self.value() == "1":
            return queryset.exclude(Exists(active_qs))
        if self.value() == "0":
            return queryset.exclude(Exists(any_qs))
        return queryset


class LabelInline(admin.TabularInline):
    model = Label
    extra = 0


class TagInline(admin.TabularInline):
    model = Tag
    extra = 0


class GroupTypeAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "is_map"]
    autocomplete_fields = ["extra_parents"]
    inlines = [LabelInline, TagInline]


class GroupAdmin(SimpleHistoryAdmin):
    search_fields = ["name", "short_name", "slug"]
    actions = ["archive_groups"]
    list_display = [
        "name",
        "group_type",
        "has_members",
        "has_active_members",
        "archived",
    ]
    list_filter = [
        "group_type",
        HasMembersFilter,
        "archived",
        "public",
        "private",
    ]
    exclude = ["members", "subscribers"]
    readonly_fields = [
        "id",
        "created_by",
        "created_at",
        "updated_by",
        "updated_at",
        "members_admin_link",
    ]
    autocomplete_fields = ["parent", "tags", "social_links"]

    def get_queryset(self, request):
        today = timezone.localdate()
        any_qs = Membership.objects.filter(group=OuterRef("pk"))
        active_qs = any_qs.filter(
            Q(end_date__isnull=True) | Q(end_date__gte=today)
        )
        return (
            super()
            .get_queryset(request)
            .annotate(
                has_members=Exists(any_qs),
                has_active_members=Exists(active_qs),
            )
        )

    @admin.display(
        description="Has members", boolean=True, ordering="has_members"
    )
    def has_members(self, obj):
        return obj.has_members

    @admin.display(
        description="Active members",
        boolean=True,
        ordering="has_active_members",
    )
    def has_active_members(self, obj):
        return obj.has_active_members

    @admin.display(description="Members list")
    def members_admin_link(self, obj):
        today = timezone.localdate()
        counts = obj.membership_set.aggregate(
            total=Count("pk"),
            active=Count(
                "pk",
                filter=Q(end_date__isnull=True) | Q(end_date__gte=today),
            ),
        )
        url = (
            reverse("admin:group_membership_changelist")
            + f"?group__id__exact={obj.pk}"
        )
        return format_html(
            '<a href="{}">{} memberships for this group ({} active)</a>',
            url,
            counts["total"],
            counts["active"],
        )

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if obj:
            form.base_fields["label"].queryset = obj.group_type.label_set.all()
            form.base_fields["tags"].queryset = obj.group_type.tag_set.all()
        return form

    @admin.action(description="Archive selected groups")
    def archive_groups(self, request, queryset):
        queryset.update(archived=True)


class MembershipAdmin(admin.ModelAdmin):
    search_fields = [
        "user__first_name",
        "user__last_name",
        "group__name",
        "group__short_name",
    ]
    list_display = ["user", "group", "is_active", "admin"]
    list_filter = ["admin", "group__group_type"]
    readonly_fields = ["id"]

    @admin.display(description="Active", boolean=True)
    def is_active(self, obj):
        today = timezone.localdate()
        return obj.end_date is None or obj.end_date >= today


class TagAdmin(admin.ModelAdmin):
    search_fields = ["name"]


admin.site.register(GroupType, GroupTypeAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(Membership, MembershipAdmin)
admin.site.register(Tag, TagAdmin)
