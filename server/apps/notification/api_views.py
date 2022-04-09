from django.db.utils import IntegrityError
from django.http import JsonResponse

from push_notifications.models import GCMDevice
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError, NotFound, MethodNotAllowed

from .models import Notification, SentNotification, Subscription
from .serializers import SentNotificationSerializer


class SubscriptionAPIView(APIView):
    """API endpoint to get, add or delete subscriptions.

    Path Parameters
    ---------------
    page : slug
        The page we want to manage the subscription.

    Methods
    -------
    GET
        Search if the subscription exists
    POST
        Subscribe the authentificated user to the given page
    DELETE
        Unsubscribe the authentificated user to the given page
    
    Returns
    -------
    A boolean : True if the user has subscribed to the page, else False.
    """
    permission_classes = [permissions.IsAuthenticated]


    def get(self, request, page, format=None):
        """Get the state of the subscription of current user to a page."""

        student = request.user.student
        res = Subscription.objects.filter(page=page, student=student).exists()
        return Response(data=res)


    def post(self, request, page, *args, **kwargs):
        """Register the subscription of a user to a page"""

        student = request.user.student
        try:
            Subscription.objects.create(page=page, student=student)
            return Response(status=status.HTTP_201_CREATED, data=True)
        except IntegrityError:
            raise MethodNotAllowed(
                method="POST", 
                detail="User has already subscribed! Use DELETE to unsubscribe."
            )
    

    def delete(self, request, page, *args, **kwargs):
        """Delete the subscription of a user to a page"""

        student = request.user.student
        try:
            obj = Subscription.objects.get(page=page, student=student)
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT, data=False)
        except Subscription.DoesNotExist:
            raise NotFound("Cannot delete the subscription: user did not subscribed")



class GetNotificationsAPIView(APIView):
    """API endpoint to get all notifications sent to a user.
    
    Query Paramaters
    ----------------
    mode : int
        Indicate the mode: 1 for counting notifications, 2 for getting content
    sub : boolean (optional)
        Indicate if we get only the notifications from pages user has subscribed
        or from all pages.
        Default to False
    nbStart : int (optional)
    nbEnd : int (optional)
        For mode 2 only. Indicate the range of notifications we want to load.
        Default to [0, 20].
    
    Methods
    -------
    GET
        Get a count of notifications or the notifications content according to
        the selected mode.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        """Get the notifications themselves or the number of them"""
        student = request.user.student
        # firstly we get parameters
        try:
            mode = int(request.query_params.get('mode'))
        except ValueError:
            raise ValidationError(
                "Please indicate a correct mode : 1 (count only) or 2 (get content)")
        sub_only_str = request.query_params.get('sub', 'false').lower()
        if sub_only_str != "true" and sub_only_str != "false":
            raise ValidationError("The 'sub' attribute must be a boolean")
        sub_only = (sub_only_str == "true")
        # then we make the query
        query = SentNotification.objects.filter(student=student).order_by('-notification__date')
        if sub_only: 
            query = query.filter(subscribed=True)
        # if we are in mode 1, we count
        if mode == 1:
            n = query.filter(seen=False).count()
            return Response(data=n)
        # else for mode 2
        # we define the range of notifications we want to send
        n = query.count()
        nb_start = int(request.query_params.get('start', 0))
        nb_end   = int(request.query_params.get('end', 20))
        if nb_end > n: nb_end = n
        if nb_start > nb_end: nb_start = nb_end
        # we select the ones in the range and send them
        query = query[nb_start:nb_end]
        serializer = SentNotificationSerializer(query, many=True)
        return Response(serializer.data)



class ManageNotificationAPIView(APIView):
    """API endpoint to mark or unmark a SentNotification of a user as seen.
    
    Path Parameters
    ---------------
    id : int
        The id of the notification object to mark
    
    Query Parameters
    ----------------
    markAsSeen : boolean (optional)
        Indicate if we must force the notifications to be marked as seen
        Default to false
    
    Methods
    -------
    POST
        Mark if not marked or unmarked if already marked a notification as seen 
        for the authentificated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, notif_id, format=None):
        """Mark or unmark a notification as read"""
        student = request.user.student
        mark_as_seen_str = request.query_params.get('markAsSeen', "false").lower()
        if mark_as_seen_str != "true" and mark_as_seen_str != "false":
            raise ValidationError("The 'markAsSeen' attribute must be a boolean")
        mark_as_seen = (mark_as_seen_str == "true")
        try:
            obj = SentNotification.objects.get(
                student=student,
                notification=notif_id
            )
            if mark_as_seen:
                obj.seen = True
            else:
                obj.seen = not(obj.seen)
            obj.save()
            return Response(status=status.HTTP_202_ACCEPTED, data=obj.seen)
        except SentNotification.DoesNotExist:
            raise NotFound(f"The requested notification {notif_id} does not \
                            exist in database or has not been sent to the user.")



class RegisterAPIView(APIView):
    """View to register a user for notifications."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        object, created = GCMDevice.objects.get_or_create(
            registration_id = request.data.get('registration_id'),
            cloud_message_type = 'FCM',
            user = request.user,
        )
        data = {
            'result': created
        }
        return JsonResponse(data)