from django.contrib import admin

from .models import Group, GroupType, Membership


class GroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'type']
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


class GroupTypeAdmin(admin.ModelAdmin):
    list_display = ['name']


admin.site.register(Group, GroupAdmin)
admin.site.register(Membership, MembershipAdmin)
admin.site.register(GroupType, GroupTypeAdmin)
