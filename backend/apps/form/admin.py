from django.contrib import admin

from .models import FormAnswer, FormSchema, UserRole


class UserRoleInline(admin.TabularInline):
    model = UserRole
    extra = 0
    autocomplete_fields = ["user"]


class FormAnswerInline(admin.TabularInline):
    model = FormAnswer
    extra = 0
    autocomplete_fields = ["user"]
    readonly_fields = ["submitted_at", "modified_at"]
    fields = ["user", "submitted_at", "modified_at", "data"]


@admin.register(FormSchema)
class FormSchemaAdmin(admin.ModelAdmin):
    list_display = ["name", "editable", "public"]
    search_fields = ["name", "description"]
    inlines = [UserRoleInline, FormAnswerInline]


@admin.register(FormAnswer)
class FormAnswerAdmin(admin.ModelAdmin):
    list_display = ["uuid", "form_schema", "user", "submitted_at", "modified_at"]
    list_filter = ["form_schema"]
    search_fields = ["form_schema__name", "user__first_name", "user__last_name"]
    autocomplete_fields = ["form_schema", "user"]
    readonly_fields = ["submitted_at", "modified_at"]


@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ["user", "form_schema", "role"]
    list_filter = ["role", "form_schema"]
    search_fields = ["user__first_name", "user__last_name", "form_schema__name"]
    autocomplete_fields = ["user", "form_schema"]
