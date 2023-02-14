from django.contrib import admin

from .models import BaseEvent


class BaseEventAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'group_slug']


admin.site.register(BaseEvent, BaseEventAdmin)
