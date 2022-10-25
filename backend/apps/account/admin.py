from django.contrib import admin
from django.contrib.sites.shortcuts import get_current_site
from django.core import mail
from django.template.loader import render_to_string
from .models import TemporaryAccessRequest
from django.conf import settings


from .models import IdRegistration
# Register your models here.


class IdRegistrationAdmin(admin.ModelAdmin):
    list_display = ["id"]


class TemporaryAccessRequestAdmin(admin.ModelAdmin):
    actions = ["send_reminder"]
    list_display = ["user"]

    @admin.action(description="Send reminder to upgrade account.")
    def send_reminder(self, request, queryset):
        connection = mail.get_connection()
        current_site = get_current_site(request)
        mails = []
        for temp_access_request in queryset:
            temp_access_request: TemporaryAccessRequest
            email_html = render_to_string(
                'account/mail/reminder_upgrade.html',
                context={
                    'tempAccess': temp_access_request.user,
                    'deadline': settings.TEMPORARY_ACCOUNTS_DATE_LIMIT,
                    'domain': current_site.domain
                }
            )
            email = mail.EmailMultiAlternatives(
                subject="[Nantral Platform] Votre compte expire bientôt !",
                body=email_html,
                to=[temp_access_request.user.email]
            )
            email.attach_alternative(content=email_html, mimetype="text/html")
            mails.append(email)
        connection.send_messages(mails)


admin.site.register(IdRegistration, IdRegistrationAdmin)
admin.site.register(TemporaryAccessRequest, TemporaryAccessRequestAdmin)
