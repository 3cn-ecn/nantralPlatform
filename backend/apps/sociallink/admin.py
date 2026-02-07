from django.contrib import admin

from .models import SocialLink


class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ["uri", "label", "id"]
    search_fields = ["uri", "id", "label"]


admin.site.register(SocialLink, SocialLinkAdmin)
