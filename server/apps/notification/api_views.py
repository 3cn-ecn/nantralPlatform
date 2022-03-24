from django.db.utils import IntegrityError
from django.http import JsonResponse

from push_notifications.models import GCMDevice
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SentNotification, Subscription
from .serializers import SentNotificationSerializer


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
        # firstly we get parameters
        count = request.query_params.get('count', '').lower() == "true"
        subOnly = request.query_params.get('sub', '').lower() == "true"
        # then we make the query
        query = SentNotification.objects.filter(student=student).order_by('-notification__date')
        if subOnly: 
            query = query.filter(subscribed=True)
        # if we only have to count, we count
        if count:
            n = query.filter(seen=False).count()
            return Response(data=n)
        # then we count the number of results
        nbStart = int(request.query_params.get('start', 0))
        nbEnd   = int(request.query_params.get('end', 20))
        n = query.count()
        if nbEnd > n: nbEnd = n
        if nbStart > nbEnd: nbStart = nbEnd
        # we take the ones we will send and send them
        query = query[nbStart:nbEnd]
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



class ReisterAPIView(APIView):
    """View to register a user for notifications."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        GCMDevice.objects.create(
            registration_id = request.data.get('registration_id'),
            cloud_message_type = 'FCM',
            user = request.user,
        )
        data = {
            'result': True
        }
        return JsonResponse(data)