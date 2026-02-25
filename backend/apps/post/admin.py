from django.contrib import admin

from .models import Post


class PostAdmin(admin.ModelAdmin):
    list_display = ["title", "created_at", "group"]
    readonly_fields = ["updated_by"]
    autocomplete_fields = ["created_by", "group"]

    def save_model(
        self,
        request,
        obj,
        form,
        change,
    ):
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)


admin.site.register(Post, PostAdmin)
