# spell-checker: words notif

from django.db.models import QuerySet
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from push_notifications.models import WebPushDevice
from rest_framework import filters, permissions, status
from rest_framework.decorators import action
from rest_framework.request import QueryDict
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.group.models import Group
from apps.utils.parse import parse_bool

from .models import SentNotification
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
        Subscribe the authenticated user to the given page
    DELETE
        Unsubscribe the authenticated user to the given page

    Returns
    -------
    A boolean : True if the user has subscribed to the page, else False.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, slug, *args, **kwargs):
        """Get the state of the subscription of current user to a page."""

        res = request.user.subscriptions.filter(slug=slug).exists()
        return Response(data=res)

    def post(self, request, slug, *args, **kwargs):
        """Register the subscription of a user to a page"""

        user = request.user
        group = get_object_or_404(Group, slug=slug)
        group.subscribers.add(user)
        return Response(status=status.HTTP_201_CREATED, data=True)

    def delete(self, request, slug, *args, **kwargs):
        """Delete the subscription of a user to a page"""

        user = request.user
        group = get_object_or_404(Group, slug=slug)
        group.subscribers.remove(user)
        return Response(status=status.HTTP_204_NO_CONTENT, data=False)


class NotificationsViewSet(ReadOnlyModelViewSet):
    """API endpoint to get all notifications sent to a user.

    Query Parameters
    ----------------
    - subscribed : boolean (optional)
        Indicate if we get only the notifications from pages user has subscribed
        or from other pages.
        Default to False
    - seen : boolean (optional)
        Include only notifications which have been seen or not.
    - page: int
        the index of the page
    - page_size: int
        the number of notifications per page
    """

    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ["notification__title", "notification__body"]
    serializer_class = SentNotificationSerializer
    lookup_field = "notification__id"

    @property
    def query_params(self) -> QueryDict:
        return self.request.query_params

    def get_queryset(self) -> QuerySet[SentNotification]:
        user = self.request.user
        subscribed = parse_bool(self.query_params.get("subscribed"))
        seen = parse_bool(self.query_params.get("seen"))

        query = user.sentnotification_set
        if subscribed is not None:
            query = query.filter(subscribed=subscribed)
        if seen is not None:
            query = query.filter(seen=seen)
        return query.order_by("-notification__date")

    @action(detail=False, methods=["GET"])
    def count(self, request, *args, **kwargs):
        total = self.get_queryset().count()
        return Response(data=total)

    @action(detail=False, methods=["POST"])
    def all_seen(self, request, *args, **kwargs):
        request.user.sentnotification_set.update(seen=True)
        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=["POST", "DELETE"])
    def seen(self, request, *args, **kwargs):
        """
        A view to check or uncheck a notification as seen by the user.
        """
        sent_notification = self.get_object()

        if request.method == "DELETE":
            sent_notification.seen = False
            sent_notification.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        sent_notification.seen = True
        sent_notification.save()
        return Response(status=status.HTTP_201_CREATED)


class RegisterAPIView(APIView):
    """View to register a user for device notifications."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        already_registered = WebPushDevice.objects.filter(
            registration_id=request.data.get("registration_id"),
        ).exists()
        data = {"result": False}
        if not already_registered:
            WebPushDevice.objects.create(
                registration_id=request.data.get("registration_id"),
                p256dh=request.data.get("p256dh"),
                auth=request.data.get("auth"),
                browser=request.data.get("browser"),
                user=request.user,
            )
            data["result"] = True
        return JsonResponse(data)
