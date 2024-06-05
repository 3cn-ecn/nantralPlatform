from rest_framework import serializers


class FeedbackSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    type = serializers.ChoiceField(choices=["bug", "suggestion"])
    description = serializers.CharField()
