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
            return Response(status=status.HTTP_400_BAD_REQUEST)
        res = Subscription.hasSubscribed(page=page, student=student)
        return Response(data=res)

    def post(self, request, *args, **kwargs):
        "Current user subscribe to the page"
        student = request.user.student
        page = request.query_params.get('slug', None)
        if page is None: 
            return Response(status=status.HTTP_400_BAD_REQUEST)
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
            return Response(status=status.HTTP_400_BAD_REQUEST)
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
        """Get the notifications themselves or the number of them"""
        student = request.user.student
        # if we ask to count, we count
        count = request.query_params.get('count', None)
        if count is not None:
            if count=="sub" or count=="all":
                nbNotifs = SentNotification.objects.filter(
                    student=student,
                    subscribed=(count=="sub"),
                    seen=False,
                ).count()
                return Response(data=nbNotifs)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        # else we load all notifications
        subscribedOnly = (request.query_params.get('sub', "").lower() == "true")
        nbMax = int(request.query_params.get('nb', 0))
        query = SentNotification.objects.filter(student=student).order_by('-notification__date')
        if subscribedOnly: 
            query = query.filter(subscribed=True)
        if nbMax:
            query = query[:nbMax]
        serializer = SentNotificationSerializer(query, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        """Mark a notifications as read"""
        student = request.user.student
        notif_id = request.query_params.get('notif_id', None)
        mark_read = request.query_params.get('mark_read', None)
        if notif_id is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            obj = SentNotification.objects.get(
                student=student,
                notification=notif_id
            )
            if mark_read is None:
                obj.seen = not(obj.seen)
            else:
                obj.seen = (mark_read.lower() == "true")
            obj.save()
            return Response(status=status.HTTP_202_ACCEPTED, data=obj.seen)
        except SentNotification.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


