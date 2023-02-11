from django.contrib import admin

from .models import Group, GroupType, Membership


class GroupTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    autocomplete_fields = ['extra_parents']


class GroupAdmin(admin.ModelAdmin):
    search_fields = ['name', 'short_name']
    list_display = ['name', 'short_name', 'group_type']
    list_filter = ['group_type', 'year', 'public', 'private', 'archived']
    exclude = ['members', 'subscribers']
    raw_id_fields = ['social_links']
    readonly_fields = [
        'created_by',
        'created_at',
        'updated_by',
        'updated_at']

    def save_model(self, request, obj: Group, form, change):
        obj.updated_by = request.user.student
        super().save_model(request, obj, form, change)


class MembershipAdmin(admin.ModelAdmin):
    search_fields = [
        'student__user__first_name',
        'student__user__last_name',
        'group__name',
        'group__short_name']
    list_display = ['student', 'group', 'admin']
    list_filter = ['admin', 'group__group_type']


admin.site.register(GroupType, GroupTypeAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(Membership, MembershipAdmin)
