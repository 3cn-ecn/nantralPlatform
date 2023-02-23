from django.contrib import admin
from .models import SocialLink, SocialNetwork


class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ['uri', 'network', 'label', 'id']
    search_fields = ['uri', 'id', 'network__name', 'label']
    list_filter = ['network']


class SocialNetworkAdmin(admin.ModelAdmin):
    list_display = ['name']


admin.site.register(SocialNetwork, SocialNetworkAdmin)
admin.site.register(SocialLink, SocialLinkAdmin)
