from django.contrib import admin
from .models import Liste, NamedMembershipList


class ListeAdmin(admin.ModelAdmin):
    list_display = ['name', 'liste_type', 'year']


class NamedMembershipListAdmin(admin.ModelAdmin):
    list_display = ['student', 'liste', 'function']


admin.site.register(NamedMembershipList, NamedMembershipListAdmin)
admin.site.register(Liste, ListeAdmin)
