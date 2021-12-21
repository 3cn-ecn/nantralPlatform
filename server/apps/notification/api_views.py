from django.http.response import HttpResponse
from django.db.utils import IntegrityError

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Subscription
from .serializers import SubscriptionSerializer


class SubscriptionAPIView(APIView):
    """API endpoint to read, add or delete subscriptions."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        "Read if current user has subscribed to a page"
        student = request.user.student
        page = request.query_params.get('slug')
        res = Subscription.hasSubscribed(page=page, student=student)
        return Response(data=res)

    def post(self, request, *args, **kwargs):
        "Current user subscribe to the page"
        student = request.user.student
        page = request.query_params.get('slug')
        try:
            Subscription.objects.create(page=page, student=student)
            return Response(status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        "Current user unsubsribe from the page"
        student = request.user.student
        page = request.query_params.get('slug')
        try:
            obj = Subscription.objects.get(page=page, student=student)
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Subscription.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
