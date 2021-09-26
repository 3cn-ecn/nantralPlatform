from django.contrib import admin
from .models import Course, NamedMembershipCourse

class CourseAdmin(admin.ModelAdmin):
    list_display = ['name', 'type']

class NamedMembershipCourseAdmin(admin.ModelAdmin):
    list_display = ['student', 'group', 'year']

admin.site.register(Course, CourseAdmin)
admin.site.register(NamedMembershipCourse, NamedMembershipCourseAdmin)
