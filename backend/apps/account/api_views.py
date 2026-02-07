from django.contrib.auth import authenticate, login, logout
from django.utils.translation import gettext_lazy as _

from rest_framework import exceptions, mixins, permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework.throttling import AnonRateThrottle
from rest_framework.viewsets import GenericViewSet

from ..utils.parse import parse_int
from .models import Email, InvitationLink, User
from .serializers import (
    ChangeEmailSerializer,
    ChangePasswordSerializer,
    EmailSerializer,
    InvitationRegisterSerializer,
    InvitationValidSerializer,
    LoginSerializer,
    RegisterSerializer,
    ShortEmailSerializer,
    UserSerializer,
    VisibilitySerializer,
)
from .utils import send_email_confirmation

SUCCESS = 0
EMAIL_NOT_VALIDATED = 1
TEMPORARY_ACCOUNT_EXPIRED = 2
ACCOUNT_TEMPORARY = 3
FAILED = 4
EMAIL_CHANGED = 5
ECN_EMAIL_NOT_VALIDATED = 6


class CanEditProfileOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if isinstance(obj, User):
            return request.user is not None and (
                request.user == obj or request.user.is_superuser
            )
        if isinstance(obj, Email):
            return request.user is not None and (
                request.user == obj.user or request.user.is_superuser
            )


class AuthViewSet(GenericViewSet):
    authentication_classes = [SessionAuthentication]

    @action(
        detail=False,
        methods=["POST"],
        serializer_class=LoginSerializer,
        throttle_classes=[AnonRateThrottle],
    )
    def login(self, request: Request):
        """Login using your email and password
        If login is successful a session cookie is returned
        If account is not verified and email_ecn is provided,
        add the email to the account
        POST:
            - email
            - password
            - email_ecn?
        """
        serializer = self.serializer_class(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data.get("email")
        password = serializer.validated_data.get("password")

        user: User = authenticate(username=email, password=password)

        data = {}

        # Wrong credentials
        if user is None:
            data["message"] = _("Authentication failed")
            data["code"] = FAILED
            response_status = status.HTTP_401_UNAUTHORIZED

        # Not verified primary email
        elif not user.is_email_valid():
            data["message"] = _(
                "Your e-mail is not verified. Please click on the link verification link"
            )
            data["code"] = EMAIL_NOT_VALIDATED
            response_status = status.HTTP_401_UNAUTHORIZED

        # Temporary account
        elif user.invitation is not None and user.invitation.is_valid():
            login(request=request, user=user)
            data["message"] = _(
                "Connection successful, your account is temporary, please add your ECN email "
                "address as soon as possible."
            )
            data["code"] = ACCOUNT_TEMPORARY
            response_status = status.HTTP_200_OK

        # Expired invitation
        elif user.invitation is not None and not user.invitation.is_valid():
            if not user.has_ecn_email():
                email_ecn = serializer.validated_data.get("email_ecn")
                if email_ecn:
                    user.add_email(email_ecn, request=request)
                    data["message"] = _(
                        "Please check your emails in order to verify the new email address"
                    )
                    data["code"] = EMAIL_CHANGED
                    response_status = status.HTTP_401_UNAUTHORIZED
                else:
                    data["message"] = _(
                        "Your account is not verified and has been disabled. Pleas add an email "
                        "address from Centrale Nantes to reactivate your account."
                    )
                    data["code"] = TEMPORARY_ACCOUNT_EXPIRED
                    response_status = status.HTTP_401_UNAUTHORIZED
            elif not user.has_valid_ecn_email():
                data["message"] = _(
                    "Your ECN e-mail is not verified. Please click on the verification link or "
                    "add another address"
                )
                data["code"] = ECN_EMAIL_NOT_VALIDATED
                data["emails_ecn"] = [
                    email.email
                    for email in user.emails.filter(is_valid=False)
                    if email.is_ecn_email()
                ]
                response_status = status.HTTP_401_UNAUTHORIZED
            else:
                # Here, the user has a valid ECN email but invitation is not null, so we fix it
                user.invitation = None
                user.save()
                login(user=user, request=self.request)
                data["message"] = _("Successfully connected")
                data["code"] = SUCCESS
                response_status = status.HTTP_200_OK
        else:
            login(request=request, user=user)
            data["message"] = _("Successfully connected")
            data["code"] = SUCCESS
            response_status = status.HTTP_200_OK

        return Response(
            data,
            status=response_status,
        )

    @action(
        detail=False,
        methods=["POST"],
        serializer_class=InvitationRegisterSerializer,
        throttle_classes=[AnonRateThrottle],
    )
    def register(self, request: Request):
        """Create a new account"""
        data = request.data

        if data.get("invitation_uuid"):
            serializer = InvitationRegisterSerializer(
                data=data, context={"request": request}
            )
        else:
            serializer = RegisterSerializer(
                data=data, context={"request": request}
            )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer.save()
        return Response(
            serializer.validated_data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["POST"], serializer_class=Serializer)
    def logout(self, request):
        """Logout from current session"""
        logout(request)
        return Response(status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["GET"],
        permission_classes=[IsAuthenticated],
        serializer_class=Serializer,
    )
    def is_authenticated(self, request: Request):
        """Returns HTTP 200 if authenticated else HTTP 403"""
        return Response({"message": "ok"}, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["POST"],
        permission_classes=[IsAuthenticated],
        serializer_class=ChangePasswordSerializer,
    )
    def change_password(self, request: Request):
        """Change password for an authenticated user
        - old_password
        - new_password
        """
        data = request.data
        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        user: User = request.user
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        # make sure user is not logged out by login him again
        login(request=request, user=user)
        return Response({"message": _("The new password has been saved")})

    @action(
        detail=False,
        methods=["POST"],
        serializer_class=InvitationValidSerializer,
        throttle_classes=[AnonRateThrottle],
    )
    def validate_invitation(self, request: Request):
        """Validate an invitation uuid. Returns 404 if not valid"""
        data = request.data
        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

        uuid = serializer.validated_data.get("uuid")
        if (
            not InvitationLink.objects.filter(id=uuid).exists()
            or not InvitationLink.objects.get(id=uuid).is_valid()
        ):
            # invalid invitation
            raise exceptions.NotFound()
        expires_at = InvitationLink.objects.get(id=uuid).expires_at
        return Response(
            {"status": "OK", "expires_at": expires_at},
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["PUT", "GET"],
        permission_classes=[CanEditProfileOrReadOnly, IsAuthenticated],
        serializer_class=UserSerializer,
        queryset=User.objects.all(),
    )
    def edit(self, request: Request, pk):
        """Edit account informations"""

        if request.method == "PUT":
            serializer = UserSerializer(
                instance=self.get_object(), data=request.data
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(
                serializer.validated_data, status=status.HTTP_200_OK
            )

        if request.method == "GET":
            serializer = UserSerializer(instance=self.get_object())

            return Response(serializer.data, status=status.HTTP_200_OK)


class EmailViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    GenericViewSet,
):
    serializer_class = EmailSerializer
    permission_classes = [CanEditProfileOrReadOnly, IsAuthenticated]
    lookup_field = "uuid"

    @property
    def user(self):
        user_id = parse_int(self.request.query_params.get("user"))
        if user_id:
            return get_object_or_404(User, id=user_id)
        return self.request.user

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return self.user.emails.all()
        return Email.objects.none()

    @action(
        detail=False,
        methods=["PUT"],
        serializer_class=ChangeEmailSerializer,
    )
    def change(self, request: Request):
        """Change email. This will send a confirmation email to the new email"""
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        user: User = self.user
        email = serializer.validated_data["email"]
        if not user.has_email(email):
            user.email = user.add_email(email, request=request)
            message = _(
                "Your main e-mail has been saved. Please click on the link verification link"
            )
        else:
            user.email = user.emails.get(email__iexact=email)
            message = _("Your main email has been saved")
        user.save()

        return Response(
            {"message": message},
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user.email == instance:
            raise exceptions.ValidationError(
                _("You cannot delete the main email address of your account")
            )
        return super().destroy(request, *args, **kwargs)

    @action(
        detail=False,
        methods=["POST"],
        serializer_class=ShortEmailSerializer,
        throttle_classes=[AnonRateThrottle],
        permission_classes=[],
    )
    def resend(self, request: Request):
        """Resend email in case it is not received"""
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        email = serializer.validated_data.get("email")

        # always send the same response to not give information
        message = _(
            "A confirmation email has been sent to verify provided email"
        )
        response = Response(
            {"message": message},
            status=status.HTTP_200_OK,
        )
        # check account exists
        try:
            email = Email.objects.get(email__iexact=email)
        except Email.DoesNotExist:
            return response

        # don't send email if already validated
        if email.is_valid:
            return response

        send_email_confirmation(
            email,
            self.request,
        )
        return response

    @action(
        detail=True,
        methods=["PUT"],
        serializer_class=VisibilitySerializer,
        permission_classes=[CanEditProfileOrReadOnly, IsAuthenticated],
    )
    def visibility(self, request: Request, *args, **kwargs):
        email = self.get_object()
        serialed_data = self.get_serializer(data=request.data)
        if serialed_data.is_valid():
            email.is_visible = serialed_data.validated_data.get("is_visible")
            email.save()
            return Response(
                {"message": _("The visibility has been changed")},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                serialed_data.errors, status=status.HTTP_400_BAD_REQUEST
            )
