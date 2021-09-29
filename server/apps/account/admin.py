from django.contrib import admin
from django.contrib.sites.shortcuts import get_current_site
from django.core import mail
from django.template.loader import render_to_string
from .models import TemporaryAccessRequest
from django.conf import settings
# Register your models here.


class UserAdmin(admin.ModelAdmin):
    pass


class TemporaryAccessRequestAdmin(admin.ModelAdmin):
    actions = ["send_reminder"]

    @admin.action(description="Send reminder to upgrade account.")
    def send_reminder(self, request, queryset):
        connection = mail.get_connection()
        current_site = get_current_site(request)
        mails = []
        for tempAccessReq in queryset:
            tempAccessReq: TemporaryAccessRequest
            email_html = render_to_string(
                'account/mail/reminder_upgrade.html',
                context={
                    'tempAccess': tempAccessReq.user,
                    'deadline': settings.TEMPORARY_ACCOUNTS_DATE_LIMIT,
                    'domain': current_site.domain
                }
            )
            email = mail.EmailMultiAlternatives(
                subject="[Nantral-Platform] Rappel votre accès temporaire va expirer!",
                body=email_html,
                from_email='accounts@nantral-platform.fr',
                to=[tempAccessReq.user.email]
            )
            email.attach_alternative(content=email_html, mimetype="text/html")
            mails.append(email)
        connection.send_messages(mails)


admin.site.register(TemporaryAccessRequest, TemporaryAccessRequestAdmin)
