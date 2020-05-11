from django.contrib import admin
from .models import Course, FollowCourse

class CourseAdmin(admin.ModelAdmin):
    list_display = ['name', 'course_type']

class FollowCourseAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'when']

admin.site.register(Course, CourseAdmin)
admin.site.register(FollowCourse, FollowCourseAdmin)
