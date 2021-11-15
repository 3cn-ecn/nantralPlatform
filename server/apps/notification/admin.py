from django.contrib import admin
from .models import Notification, ReceivedNotification, Subscription

# Register your models here.

class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'group', 'date', 'high_priority']

class ReceivedNotificationAdmin(admin.ModelAdmin):
    list_display = ['student', 'notification']

class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['student', 'group']

admin.site.register(Notification, NotificationAdmin)
admin.site.register(ReceivedNotification, ReceivedNotificationAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
