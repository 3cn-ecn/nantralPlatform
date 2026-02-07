from django.contrib import admin

from .models import Event


class EventAdmin(admin.ModelAdmin):
    list_display = ["title", "start_date"]
    readonly_fields = ["updated_by"]
    exclude = ["bookmarks"]
    autocomplete_fields = ["participants", "created_by"]

    def save_model(
        self,
        request,
        obj,
        form,
        change,
    ):
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)


admin.site.register(Event, EventAdmin)
