from django.contrib import admin

from .models import Post


class PostAdmin(admin.ModelAdmin):
    list_display = ["title", "publication_date", "group"]


admin.site.register(Post, PostAdmin)
