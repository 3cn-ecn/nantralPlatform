from django.contrib import admin
from .models import *


@admin.action(description='Modifier vers BDA')
def make_BDA(modeladmin, request, queryset):
    queryset.update(bdx_type = BDX.objects.get(name='BDA'))

@admin.action(description='Modifier vers BDE')
def make_BDE(modeladmin, request, queryset):
    queryset.update(bdx_type = BDX.objects.get(name='BDE'))

@admin.action(description='Modifier vers BDS')
def make_BDS(modeladmin, request, queryset):
    queryset.update(bdx_type = BDX.objects.get(name='BDS'))


class ClubAdmin(admin.ModelAdmin):
    list_display = ['name', 'bdx_type']
    actions = [make_BDE, make_BDA, make_BDS]


class BDXAdmin(admin.ModelAdmin):
    list_display = ['name']


class ClubMembershipsAdmin(admin.ModelAdmin):
    list_display = ['student', 'club', 'function', 'date_begin']


admin.site.register(Club, ClubAdmin)
admin.site.register(NamedMembershipClub, ClubMembershipsAdmin)
admin.site.register(BDX, BDXAdmin)
