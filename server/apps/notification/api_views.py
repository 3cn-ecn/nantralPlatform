from django.http.response import HttpResponse
from django.db.utils import IntegrityError

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SentNotification, Subscription
from .serializers import SentNotificationSerializer, SubscriptionSerializer


class SubscriptionAPIView(APIView):
    """API endpoint to read, add or delete subscriptions."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        "Read if current user has subscribed to a page"
        student = request.user.student
        page = request.query_params.get('slug', None)
        if page is None: 
            Response(status=status.HTTP_400_BAD_REQUEST)
        res = Subscription.hasSubscribed(page=page, student=student)
        return Response(data=res)

    def post(self, request, *args, **kwargs):
        "Current user subscribe to the page"
        student = request.user.student
        page = request.query_params.get('slug', None)
        if page is None: 
            Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            Subscription.objects.create(page=page, student=student)
            return Response(status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        "Current user unsubsribe from the page"
        student = request.user.student
        page = request.query_params.get('slug', None)
        if page is None: 
            Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            obj = Subscription.objects.get(page=page, student=student)
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Subscription.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)



class NotificationAPIView(APIView):
    """API endpoint to read all notifications of a user"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        student = request.user.student
        subscribedOnly = (request.query_params.get('sub', "").lower() == "true")
        nbMax = int(request.query_params.get('nb', 0))
        query = SentNotification.objects.filter(student=student).order_by('-notification__date')
        if subscribedOnly: 
            query = query.filter(subscribed=True)
        if nbMax:
            query = query[:nbMax]
        serializer = SentNotificationSerializer(query, many=True)
        return Response(serializer.data)

