from django.contrib import admin
from .models import TemporaryAccessRequest

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    pass


admin.site.register(TemporaryAccessRequest)