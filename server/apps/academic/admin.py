from django.contrib import admin
from .models import Course, NamedMembershipCourse

@admin.action(description='Modifier vers OD')
def make_OD(modeladmin, request, queryset):
    queryset.update(type='OD')

@admin.action(description='Modifier vers OP')
def make_OP(modeladmin, request, queryset):
    queryset.update(type='OP')

@admin.action(description='Modifier vers ITII')
def make_ITII(modeladmin, request, queryset):
    queryset.update(type='ITII')

@admin.action(description='Modifier vers Master')
def make_Master(modeladmin, request, queryset):
    queryset.update(type='Master')

@admin.action(description='Modifier vers BBA')
def make_BBA(modeladmin, request, queryset):
    queryset.update(type='BBA')


class CourseAdmin(admin.ModelAdmin):
    list_display = ['name', 'type']
    actions = [make_OD, make_OP, make_ITII, make_Master, make_BBA]

class NamedMembershipCourseAdmin(admin.ModelAdmin):
    list_display = ['student', 'group', 'year']

admin.site.register(Course, CourseAdmin)
admin.site.register(NamedMembershipCourse, NamedMembershipCourseAdmin)



