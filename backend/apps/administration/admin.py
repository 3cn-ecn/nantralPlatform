from django.contrib import admin
from .models import Administration, NamedMembershipAdministration


class AdministrationAdmin(admin.ModelAdmin):
    list_display = ['name']


class NamedMembershipAdministrationAdmin(admin.ModelAdmin):
    list_display = ['student', 'group', 'function']


admin.site.register(NamedMembershipAdministration, NamedMembershipAdministrationAdmin)
admin.site.register(Administration, AdministrationAdmin)
