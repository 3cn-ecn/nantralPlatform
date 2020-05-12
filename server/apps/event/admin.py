from django.contrib import admin

from .models import Event

class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'group']

admin.site.register(Event, EventAdmin)