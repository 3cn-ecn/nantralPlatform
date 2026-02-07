from django.contrib import admin

from simple_history.admin import SimpleHistoryAdmin

from .models import Group, GroupType, Label, Membership, Tag


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
    search_fields = ["name", "short_name"]
    list_display = ["name", "short_name", "slug", "group_type", "can_pin"]
    list_filter = [
        "group_type",
        "creation_year",
        "public",
        "private",
        "archived",
    ]
    exclude = ["members", "subscribers"]
    readonly_fields = [
        "id",
        "created_by",
        "created_at",
        "updated_by",
        "updated_at",
    ]
    autocomplete_fields = ["parent"]

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if obj:
            form.base_fields["label"].queryset = obj.group_type.label_set.all()
            form.base_fields["tags"].queryset = obj.group_type.tag_set.all()
        return form


class MembershipAdmin(admin.ModelAdmin):
    search_fields = [
        "user__first_name",
        "user__last_name",
        "group__name",
        "group__short_name",
    ]
    list_display = ["user", "group", "admin", "id"]
    list_filter = ["admin", "group__group_type"]
    readonly_fields = ["id"]


admin.site.register(GroupType, GroupTypeAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(Membership, MembershipAdmin)
