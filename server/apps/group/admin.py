from .models import *
from django.contrib import admin


class ClubAdmin(admin.ModelAdmin):
    list_display = ['name', 'bdx_type']


class ClubMembershipsAdmin(admin.ModelAdmin):
    list_display = ['student', 'club', 'function', 'year']


class ListeAdmin(admin.ModelAdmin):
    list_display = ['name', 'liste_type', 'year']


class NamedMembershipListAdmin(admin.ModelAdmin):
    list_display = ['student', 'liste', 'function']


admin.site.register(Club, ClubAdmin)
admin.site.register(NamedMembershipClub, ClubMembershipsAdmin)
admin.site.register(NamedMembershipList, NamedMembershipListAdmin)
admin.site.register(Liste, ListeAdmin)
admin.site.register(AdminRightsRequest)
