from rest_framework import serializers

from .models import Notification, SentNotification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "title", "body", "url", "icon_url", "date"]


class SentNotificationSerializer(serializers.ModelSerializer):
    notification = NotificationSerializer(read_only=True)

    class Meta:
        model = SentNotification
        fields = ["notification", "subscribed", "seen"]
