from rest_framework import serializers

from .models import Subscription, Notification, SentNotification


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['page', 'student']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'body', 'url', 'icon_url', 'date'
        ]


class SentNotificationSerializer(serializers.ModelSerializer):
    notification = NotificationSerializer(read_only=True)

    class Meta:
        model = SentNotification
        fields = ['notification', 'subscribed', 'seen']
