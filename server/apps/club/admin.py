from typing import List
from django.contrib import admin
from django.template.response import TemplateResponse
from django.urls.conf import path
from django.urls.resolvers import URLPattern
from django.utils import timezone
from .models import *


@admin.action(description='Modifier vers BDA')
def make_BDA(modeladmin, request, queryset):
    queryset.update(bdx_type=BDX.objects.get(name='BDA'))


@admin.action(description='Modifier vers BDE')
def make_BDE(modeladmin, request, queryset):
    queryset.update(bdx_type=BDX.objects.get(name='BDE'))


@admin.action(description='Modifier vers BDS')
def make_BDS(modeladmin, request, queryset):
    queryset.update(bdx_type=BDX.objects.get(name='BDS'))


class ClubAdmin(admin.ModelAdmin):
    list_display = ['name', 'bdx_type']
    actions = [make_BDE, make_BDA, make_BDS]

    def get_urls(self) -> List[URLPattern]:
        urls = super().get_urls()
        customUrls = [
            path('metrics/', self.admin_site.admin_view(self.metrics_view),
                 name='club-metrics')
        ]
        return customUrls + urls

    def metrics_view(self, request):
        no_admins = []
        for club in Club.objects.all():
            if NamedMembershipClub.objects.filter(
                    group=club.id, admin=True,
                    date_begin__year__gte=timezone.make_aware(timezone.now().year-1)).count() == 0:
                no_admins.append(club)
        context = dict(
            self.admin_site.each_context(request=request),
            no_admins=no_admins,
            total_clubs=Club.objects.all().count()
        )
        return TemplateResponse(request=request, template='admin/club/metrics.html', context=context)


class BDXAdmin(admin.ModelAdmin):
    list_display = ['name']


class ClubMembershipsAdmin(admin.ModelAdmin):
    list_display = ['student', 'group', 'function', 'date_begin', 'admin']


admin.site.register(Club, ClubAdmin)
admin.site.register(NamedMembershipClub, ClubMembershipsAdmin)
admin.site.register(BDX, BDXAdmin)
