from rest_framework import serializers
from django.templatetags.static import static

from .models import Subscription, Notification, SentNotification
from apps.student.serializers import StudentSerializer


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['page', 'student']


class NotificationSerializer(serializers.ModelSerializer):
    icon_url = serializers.SerializerMethodField("get_icon_url")

    class Meta:
        model = Notification
        fields = [
            'id', 'body', 'url', 'icon_url', 'date', 'high_priority',
            'action1_label', 'action1_url', 'action2_label', 'action2_url'
        ]
    
    def get_icon_url(self, obj):
        icon = obj.get_logo()
        if icon:
            return icon.url
        return static('img/logo.svg')


class SentNotificationSerializer(serializers.ModelSerializer):
    notification = NotificationSerializer(read_only=True)

    class Meta:
        model = SentNotification
        fields = ['notification', 'subscribed', 'seen']