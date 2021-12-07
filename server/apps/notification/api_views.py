from django.http.response import HttpResponse
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Subscription
from .serializers import *


class SubscriptionAPIView(APIView):
    """API endpoint to interact with the members of a club."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        student = request.user.student
        subscription = Subscription.objects.filter(student=student)
        serializer = SubscriptionSerializer(subscription, many=True)
        return Response(data=serializer.data)

    def post(self, request, *args, **kwargs):
        # Check if club's admin
        student = request.user.student
        page_slug = request.query_params.get('page_slug')
        query = Subscription.objects.filter(page=page_slug, student=student)
        if query.exists():
            query.first().delete()
        else:
            Subscription.objects.create(page=page_slug, student=student)
        return HttpResponse(status=200)
