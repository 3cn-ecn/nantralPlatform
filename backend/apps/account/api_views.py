from django.contrib.auth import authenticate, login, logout

from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework.throttling import AnonRateThrottle
from rest_framework.viewsets import GenericViewSet

from .models import User
from .serializers import (
    ChangeEmailSerializer,
    ChangePasswordSerializer,
    EmailSerializer,
    InvitationRegisterSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)
from .utils import send_email_confirmation

SUCCESS = 0
EMAIL_NOT_VALIDATED = 1
TEMPORARY_ACCOUNT_EXPIRED = 2
ACCOUNT_TEMPORARY = 3
FAILED = 4


class AuthViewSet(GenericViewSet):
    authentication_classes = [SessionAuthentication]

    def get_serializer(self, *args, **kwargs):
        if self.action == "edit":
            serializer = UserSerializer(instance=self.request.user)
            return serializer
        return super().get_serializer(*args, **kwargs)

    @action(
        detail=False,
        methods=["POST"],
        serializer_class=LoginSerializer,
        throttle_classes=[AnonRateThrottle],
    )
    def login(self, request: Request):
        """Login using your email and password
        If login is successful a session cookie is returned
        POST:
            - email
            - password
        """
        data = request.data
        serializer = LoginSerializer(data=data)

        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        email = serializer.validated_data.get("email")
        password = serializer.validated_data.get("password")

        user: User = authenticate(username=email, password=password)

        # Wrong credentials
        if user is None:
            return Response(
                {
                    "message": "Authentication Failed",
                    "code": FAILED,
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Expired invitation
        if user.invitation is not None and not user.invitation.is_valid():
            return Response(
                {
                    "message": "Authentication Failed",
                    "code": TEMPORARY_ACCOUNT_EXPIRED,
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Not verified email
        if not user.is_email_valid:
            return Response(
                {
                    "message": "Email is not verified",
                    "code": EMAIL_NOT_VALIDATED,
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Temporary account
        if user.invitation is not None and user.invitation.is_valid():
            message = "You are connected on a temporary account"
            login(request=request, user=user)
            return Response(
                data={"message": message, "code": ACCOUNT_TEMPORARY},
                status=status.HTTP_200_OK,
            )

        login(request=request, user=user)
        return Response(
            data={"message": "Connection success", "code": SUCCESS},
            status=status.HTTP_200_OK,
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
            serializer = InvitationRegisterSerializer(data=data)
            temporary = True
        else:
            serializer = RegisterSerializer(data=data)
            temporary = False

        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        user = serializer.save()
        send_email_confirmation(
            user, request=request, temporary_access=temporary
        )
        return Response(
            serializer.validated_data, status=status.HTTP_201_CREATED
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
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        user: User = request.user
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        # make sure user is not logged out by login him again
        login(request=request, user=user)
        return Response({"message": "Successfully updated password"})

    @action(
        detail=False,
        methods=["PUT"],
        permission_classes=[IsAuthenticated],
    )
    def edit(self, request: Request):
        """Edit account informations"""
        serializer = UserSerializer(instance=request.user, data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save()
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class EmailViewSet(GenericViewSet):
    @action(
        detail=False,
        methods=["PUT"],
        permission_classes=[IsAuthenticated],
        serializer_class=ChangeEmailSerializer,
    )
    def change(self, request: Request):
        """Change email. This will send a confirmation email to the new email"""
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        user: User = request.user
        user.email_next = serializer.validated_data["email"]
        user.save()
        send_email_confirmation(user, request=request, temporary_access=False)
        message = "A confirmation email has been sent to verify provided email"
        return Response(
            {"message": message},
            status=status.HTTP_200_OK,
        )

    @action(
        detail=False,
        methods=["POST"],
        serializer_class=EmailSerializer,
        throttle_classes=[AnonRateThrottle],
    )
    def resend(self, request: Request):
        """Resend email in case it is not received"""
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        email = serializer.validated_data.get("email")

        # always send the same response to not give informations
        message = "A confirmation email has been sent to verify provided email"
        response = Response(
            {"message": message},
            status=status.HTTP_200_OK,
        )
        # check account exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return response

        # don't send email if already validated
        if user.is_email_valid and not user.email_next:
            return response

        temp_access = user.invitation is not None
        send_email_confirmation(
            user, self.request, temporary_access=temp_access, send_to=email
        )
        return response
