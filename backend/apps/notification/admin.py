from django.contrib import admin

from .models import Notification, SentNotification

# Register your models here.


class NotificationAdmin(admin.ModelAdmin):
    list_display = ["__str__", "id", "date", "nb_targets"]


class SentNotificationAdmin(admin.ModelAdmin):
    list_display = ["user", "notification", "date"]


admin.site.register(Notification, NotificationAdmin)
admin.site.register(SentNotification, SentNotificationAdmin)
