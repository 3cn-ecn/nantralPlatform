from typing import List

from django.contrib import admin
from django.db.models import Count
from django.template.response import TemplateResponse
from django.urls import path
from django.urls.resolvers import URLPattern

from .models import Student


class StudentInline(admin.StackedInline):
    model = Student
    can_delete = False


class StudentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "promo")
    search_fields = (
        "user__first_name",
        "user__last_name",
        "user__email",
    )

    def get_urls(self) -> List[URLPattern]:
        urls = super().get_urls()
        custom_urls = [
            path(
                "metrics/",
                self.admin_site.admin_view(self.metrics_view),
                name="student-metrics",
            )
        ]
        return custom_urls + urls

    def metrics_view(self, request):
        context = dict(
            self.admin_site.each_context(request=request),
            promos=Student.objects.all()
            .values("promo")
            .annotate(count=Count("promo"))
            .order_by(),
            nb_students=Student.objects.all().count(),
        )
        return TemplateResponse(
            request=request,
            template="admin/student/metrics.html",
            context=context,
        )


admin.site.register(Student, StudentAdmin)
