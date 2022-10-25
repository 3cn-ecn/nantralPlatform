from django.contrib import admin

from .models import BaseEvent, EatingEvent


class BaseEventAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'group']


class EatingEventAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'group', 'menu']


admin.site.register(BaseEvent, BaseEventAdmin)
admin.site.register(EatingEvent, EatingEventAdmin)
