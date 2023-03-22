from django.contrib import admin

from .models import Event


class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'date']
    readonly_fields = ['updated_by']

    def save_model(self, request, obj, form, change,):
        obj.updated_by = request.user.student
        super().save_model(request, obj, form, change)


admin.site.register(Event, EventAdmin)
