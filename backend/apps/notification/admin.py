from django.contrib import admin
from .models import Notification, SentNotification, Subscription

# Register your models here.

class NotificationAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'date', 'nbTargets']

class SentNotificationAdmin(admin.ModelAdmin):
    list_display = ['student', 'notification', 'date']

class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['student', 'page']

admin.site.register(Notification, NotificationAdmin)
admin.site.register(SentNotification, SentNotificationAdmin)
admin.site.register(Subscription, SubscriptionAdmin)