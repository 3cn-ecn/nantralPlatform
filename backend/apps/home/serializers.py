from rest_framework import serializers


class FeedbackSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    kind = serializers.ChoiceField(choices=["bug", "suggestion"])
    description = serializers.CharField()
