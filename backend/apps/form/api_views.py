from typing import TYPE_CHECKING

from django.http import QueryDict

from rest_framework import exceptions, permissions, response, status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request

from apps.form.models import FormAnswer, FormSchema, UserRole
from apps.form.serializers import (
    CreateRoleSerializer,
    FormAnswerPreviewSerializer,
    FormAnswerSerializer,
    FormSchemaSerializer,
    RoleSerializer,
)
from apps.utils.parse import parse_bool, parse_int

if TYPE_CHECKING:
    from apps.account.models import User


class FormSchemaPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj: FormSchema):
        user = request.user
        if request.method in permissions.SAFE_METHODS:
            return obj.can_view_form(user)
        return obj.is_admin(user)


class FormSchemaViewSet(viewsets.ModelViewSet):
    serializer_class = FormSchemaSerializer
    permission_classes = [IsAuthenticated, FormSchemaPermission]

    def get_queryset(self):
        user = self.request.user
        return FormSchema.objects.filter(users=user)

    def get_object(self) -> FormSchema:
        form_id = self.kwargs.get("pk")
        form_schema = get_object_or_404(FormSchema, uuid=form_id)
        self.check_object_permissions(self.request, form_schema)
        return form_schema

    @action(methods=["POST", "DELETE"], detail=True)
    def active(self, request: Request, pk=None):
        obj = self.get_object()
        if request.method == "POST":
            obj.active = True
        elif request.method == "DELETE":
            obj.active = False
        else:
            raise exceptions.MethodNotAllowed
        obj.save()
        return response.Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=["POST", "DELETE"], detail=True)
    def public(self, request: Request, pk=None):
        obj = self.get_object()
        if request.method == "POST":
            obj.public = True
        elif request.method == "DELETE":
            obj.public = False
        else:
            raise exceptions.MethodNotAllowed
        obj.save()
        return response.Response(status=status.HTTP_204_NO_CONTENT)


class FormAnswerPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        form_id = view.kwargs.get("schema", None)
        form_schema = FormSchema.objects.get(uuid=form_id)
        user = request.user
        if form_schema:
            if request.method in permissions.SAFE_METHODS:  # list
                return form_schema.can_view_answers(user)
            else:  # create
                return form_schema.can_view_form(user)
        return user.is_superuser

    def has_object_permission(self, request, view, obj: FormAnswer):
        user = request.user
        if obj.user == user:
            return True

        form_schema = obj.form_schema
        if request.method in permissions.SAFE_METHODS:  # retrieve
            return form_schema.can_view_answers(user)
        else:  # destroy or update
            return form_schema.is_admin(user)


class FormAnswerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, FormAnswerPermission]

    @property
    def query_params(self) -> QueryDict:
        return self.request.query_params

    def get_queryset(self):
        user = parse_int(self.query_params.get("user"))
        schema_uuid = self.kwargs.get("schema")
        schema = get_object_or_404(FormSchema, uuid=schema_uuid)
        if user is not None:
            return schema.formanswer_set.filter(user=user)
        return schema.formanswer_set.all()

    def get_serializer_class(self):
        preview = parse_bool(self.query_params.get("preview"), True)
        if self.action == "list" and preview:
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
        form_schema = FormSchema.objects.get(uuid=form_id)
        user = request.user
        if form_schema:
            return form_schema.can_view_answers(user)
        return user.is_superuser

    def has_object_permission(self, request, view, obj: UserRole):
        user = request.user
        form_schema = obj.form_schema
        if request.method in permissions.SAFE_METHODS:
            return obj.user == user or form_schema.can_view_answers(user)
        return form_schema.is_admin(user)


class SchemaRolesViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, RolesPermission]

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
        roles = self.perform_create(serializer)
        instance_serializers = map(RoleSerializer, roles)
        return response.Response([s.data for s in instance_serializers])
