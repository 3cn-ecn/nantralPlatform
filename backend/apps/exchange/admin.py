from django.contrib import admin
from .models import Exchange

class ExchangeAdmin(admin.ModelAdmin):
    list_display = ('student', 'got')

admin.site.register(Exchange, ExchangeAdmin)