from django.contrib.auth import authenticate, login, logout
from django.utils.translation import gettext_lazy as _

from rest_framework import exceptions, mixins, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework.throttling import AnonRateThrottle
from rest_framework.viewsets import GenericViewSet

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
    UsernameSerializer,
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
        data = request.data
        serializer = self.serializer_class(data=data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data.get("email")
        password = serializer.validated_data.get("password")

        user: User = authenticate(username=email, password=password)

        # Wrong credentials
        if user is None:
            message = _("L'authentification à échoué")
            code = FAILED
            response_status = status.HTTP_401_UNAUTHORIZED

        # Not verified primary email
        elif not user.is_email_valid:
            message = _(
                "Votre e-mail n'est pas vérifié. Merci de cliquer sur le lien "
                "de vérification",
            )
            code = EMAIL_NOT_VALIDATED
            response_status = status.HTTP_401_UNAUTHORIZED

        # Temporary account
        elif user.invitation is not None and user.invitation.is_valid():
            login(request=request, user=user)
            message = _(
                "Connection réussie, votre compte est temporaire, veuillez "
                "ajouter votre adresse mail Centrale au plus vite.",
            )
            code = ACCOUNT_TEMPORARY
            response_status = status.HTTP_200_OK

        # Expired invitation
        elif user.invitation is not None and not user.invitation.is_valid():
            if not user.has_ecn_email():
                email_ecn = serializer.validated_data.get("email_ecn")
                if email_ecn:
                    user.add_email(email_ecn, request=request)
                    message = _("Veuillez consulter votre boîte mail pour vérifier la nouvelle adresse")
                    code = EMAIL_CHANGED
                    response_status = status.HTTP_201_CREATED
                else:
                    message = _(
                                "Votre compte n'est pas vérifié et a été désactivé. Veuillez ajouter "
                                "une adresse mail Centrale pour réactiver votre compte."
                            )
                    code = TEMPORARY_ACCOUNT_EXPIRED
                    response_status = status.HTTP_401_UNAUTHORIZED
            elif not user.has_valid_ecn_email():
                message = _(
                            "Votre e-mail Centrale n'est pas vérifié. Merci de cliquer sur le lien "
                            "de vérification ou renseigner une autre adresse",
                        )
                code = ECN_EMAIL_NOT_VALIDATED
                response_status = status.HTTP_401_UNAUTHORIZED
            else:
                # Here, the user has a valid ECN email but invitation is not null, so we fix it
                user.invitation = None
                user.save()
                login(user=user, request=self.request)
                message = _("Connection réussie")
                code = SUCCESS
                response_status = status.HTTP_200_OK
        else:
            login(request=request, user=user)
            message = _("Connection réussie")
            code = SUCCESS
            response_status = status.HTTP_200_OK

        return Response(
            {
                "message": message,
                "code": code,
            },
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
            serializer = InvitationRegisterSerializer(data=data)
        else:
            serializer = RegisterSerializer(data=data)

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
        return Response({"message": _("Le mot de passe à bien été mis à jour.")})

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
        detail=False,
        methods=["GET"],
        permission_classes=[IsAuthenticated],
    )
    def username(self, request: Request):
        """Edit account informations"""
        serializer = UsernameSerializer(instance=request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["PUT"],
        permission_classes=[IsAuthenticated],
    )
    def edit_username(self, request: Request):
        """Edit account informations"""
        serializer = UsernameSerializer(instance=request.user, data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer.save()
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class EmailViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.DestroyModelMixin, GenericViewSet):
    serializer_class = EmailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.emails.all()

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
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        user: User = request.user
        email = serializer.validated_data["email"]
        if not user.has_email(email):
            message = _(
                "Votre email principal a bien été enregistré. Merci de cliquer "
                "sur le lien de vérification qui vous a été envoyé."
            )
        else:
            message = _("Votre email principal a bien été enregistré.")
        user.email = email
        user.save(request=request)

        return Response(
            {"message": message},
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user.email == instance.email:
            raise exceptions.ValidationError(_("Vous ne pouvez pas supprimer l'email principal de votre compte"))
        return super().destroy(request, *args, **kwargs)

    @action(
        detail=False,
        methods=["POST"],
        serializer_class=ShortEmailSerializer,
        throttle_classes=[AnonRateThrottle],
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

        # always send the same response to not give informations
        message = _("Un mail de confirmation a été renvoyé à l'email fourni.")
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

    @action(detail=True, methods=["PUT"], serializer_class=VisibilitySerializer)
    def visibility(self, request: Request, *args, **kwargs):
        email = self.get_object()
        serialed_data = self.get_serializer(data=request.data)
        if serialed_data.is_valid():
            email.is_visible = serialed_data.validated_data.get("is_visible")
            email.save()
            return Response({"message": _("La visibilité a été changée.")}, status=status.HTTP_200_OK)
        else:
            return Response(serialed_data.errors, status=status.HTTP_400_BAD_REQUEST)
