from django.contrib import admin
from .models import Student

class StudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'promo')

admin.site.register(Student, StudentAdmin)
