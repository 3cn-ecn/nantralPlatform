from django.contrib import admin

from .models import Group, GroupType, Membership


class GroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'short_name', 'group_type']
    search_fields = ['name', 'short_name']
    list_filter = ['group_type', 'year', 'private', 'archived']
    readonly_fields = [
        'created_by',
        'created_at',
        'last_modified_by',
        'last_modified_at']

    def save_model(self, request, obj: Group, form, change):
        obj.last_modified_by = request.user.student
        super().save_model(request, obj, form, change)


class MembershipAdmin(admin.ModelAdmin):
    list_display = ['student', 'group', 'admin']
    list_filter = ['admin', 'group__group_type']
    search_fields = [
        'student__user__first_name',
        'student__user__last_name',
        'group__name',
        'group__short_name']


class GroupTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']


admin.site.register(Group, GroupAdmin)
admin.site.register(Membership, MembershipAdmin)
admin.site.register(GroupType, GroupTypeAdmin)
