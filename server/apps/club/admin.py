from django.contrib import admin
from .models import *


class ClubAdmin(admin.ModelAdmin):
    list_display = ['name', 'bdx_type']


class BDXAdmin(admin.ModelAdmin):
    list_display = ['name']


class ClubMembershipsAdmin(admin.ModelAdmin):
    list_display = ['student', 'club', 'function', 'year']


admin.site.register(Club, ClubAdmin)
admin.site.register(NamedMembershipClub, ClubMembershipsAdmin)
admin.site.register(BDX, BDXAdmin)
