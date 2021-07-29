from typing import List
from django.contrib import admin
from django.template.response import TemplateResponse
from django.urls.resolvers import URLPattern
from .models import Student
from django.urls import path
from django.db.models import Count


class StudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'promo')

    def get_urls(self) -> List[URLPattern]:
        urls = super().get_urls()
        customUrls = [
            path('metrics/', self.admin_site.admin_view(self.metrics_view),
                 name='metrics')
        ]
        return customUrls + urls

    def metrics_view(self, request):
        context = dict(
            self.admin_site.each_context(request=request),
            promos=Student.objects.all().values('promo').annotate(Count('id')),
            nb_students=Student.objects.all().count()
        )
        return TemplateResponse(request=request, template='admin/student/metrics.html', context=context)


adminst = StudentAdmin(Student, admin.site)
admin.site.register(Student, StudentAdmin)
