from typing import TYPE_CHECKING

from rest_framework import (
    permissions,
    response,
    viewsets,
)
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from apps.form.models import FormAnswer, FormSchema, UserRole
from apps.form.serializers import (
    CreateRoleSerializer,
    FormAnswerPreviewSerializer,
    FormAnswerSerializer,
    FormSchemaSerializer,
    RoleSerializer,
)

if TYPE_CHECKING:
    from apps.account.models import User


class FormSchemaViewSet(viewsets.ModelViewSet):
    queryset = FormSchema.objects.all()
    serializer_class = FormSchemaSerializer


class FormAnswerViewSet(viewsets.ModelViewSet):
    queryset = FormAnswer.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return FormAnswerPreviewSerializer
        return FormAnswerSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        schema_uuid = self.kwargs.get("schema")
        schema = get_object_or_404(FormSchema, uuid=schema_uuid)
        context["form_schema"] = schema
        return context


class RolesPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        form_id = view.kwargs.get("schema", None)
        user = request.user
        if form_id is not None:
            return (
                UserRole.objects.filter(form_schema=form_id, user=user).exists()
                or user.is_superuser
            )
        else:
            return True

    def has_object_permission(self, request, view, obj: UserRole):
        user = request.user
        user_role = UserRole.objects.filter(
            form_schema=obj.form_schema, user=user
        ).first()
        if user_role is None:
            return user.is_superuser
        # user may access their own role
        # editors may change other people roles, except owner
        # owners and superusers have full permissions
        return (
            obj.user == user
            or (user_role.role == "editor" and obj.role != "owner")
            or user_role.role == "owner"
            or user.is_superuser
        )


class SchemaRolesViewSet(viewsets.ModelViewSet):
    permission_classes = [RolesPermission, IsAuthenticated]

    def get_queryset(self):
        schema_uuid = self.kwargs.get("schema")
        schema = FormSchema.objects.filter(uuid=schema_uuid).first()
        user: User = self.request.user
        if schema is not None:
            return schema.userrole_set.all()
        else:
            return user.userrole_set.all()

    def get_serializer_class(self):
        if self.action == "create":
            return CreateRoleSerializer
        return RoleSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        schema_uuid = self.kwargs.get("schema")
        schema = get_object_or_404(FormSchema, uuid=schema_uuid)
        context["form_schema"] = schema
        return context

    def perform_create(self, serializer):
        return serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        roles: list[UserRole] = self.perform_create(serializer)
        instance_serializers = map(RoleSerializer, roles)
        return response.Response([s.data for s in instance_serializers])
