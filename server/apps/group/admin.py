from .models import *
from django.contrib import admin


class ClubAdmin(admin.ModelAdmin):
    list_display = ['name', 'bdx_type']


class ClubMembershipsAdmin(admin.ModelAdmin):
    list_display = ['student', 'club', 'function', 'year']


admin.site.register(Club, ClubAdmin)
admin.site.register(NamedMembershipClub, ClubMembershipsAdmin)


admin.site.register(AdminRightsRequest)
