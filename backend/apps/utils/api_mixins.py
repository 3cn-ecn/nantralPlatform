from django.core.exceptions import FieldDoesNotExist
from django.db import models
from django.utils.text import smart_split, unescape_string_literal

from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response


class SearchViewMixin:

    search_fields = []

    @action(detail=False, methods=['get'])
    def search(self, request: Request, *args, **kwargs):
        """
        A view to search through elements of the table, filtered by the
        'search_fields' property.

        Query Paramers
        --------------
        q: str
            The text string to search
        limit: bool
            The max number of objects to query (by default 5)

        Sources
        -------
        Based on the django-admin contrib package (see
        https://docs.djangoproject.com/en/4.1/ref/contrib/admin/#django.contrib.admin.ModelAdmin.get_search_results
        and
        https://github.com/django/django/blob/stable/4.1.x/django/contrib/admin/options.py)
        """

        queryset = self.get_queryset()
        search_term = request.query_params.get('q', '')
        limit = int(request.query_params.get('limit', 5))

        # Apply keyword searches.
        def construct_search(field_name):
            if field_name.startswith("^"):
                return "%s__istartswith" % field_name[1:]
            elif field_name.startswith("="):
                return "%s__iexact" % field_name[1:]
            elif field_name.startswith("@"):
                return "%s__search" % field_name[1:]
            # Use field_name if it includes a lookup.
            opts = queryset.model._meta
            lookup_fields = field_name.split('__')
            # Go through the fields, following all relations.
            prev_field = None
            for path_part in lookup_fields:
                if path_part == "pk":
                    path_part = opts.pk.name
                try:
                    field = opts.get_field(path_part)
                except FieldDoesNotExist:
                    # Use valid query lookups.
                    if prev_field and prev_field.get_lookup(path_part):
                        return field_name
                else:
                    prev_field = field
                    if hasattr(field, "path_infos"):
                        # Update opts to follow the relation.
                        opts = field.path_infos[-1].to_opts
            # Otherwise, use the field with icontains.
            return "%s__icontains" % field_name

        search_fields = self.search_fields
        if search_fields and search_term:
            orm_lookups = [
                construct_search(str(search_field))
                for search_field in search_fields
            ]
            term_queries = []
            for bit in smart_split(search_term):
                if bit.startswith(('"', "'")) and bit[0] == bit[-1]:
                    bit = unescape_string_literal(bit)
                or_queries = models.Q(
                    *((orm_lookup, bit) for orm_lookup in orm_lookups),
                    _connector=models.Q.OR,
                )
                term_queries.append(or_queries)
            queryset = queryset.filter(models.Q(*term_queries))

        queryset = queryset.distinct()[:limit]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class QueryFieldsMixin:
    """
    Add possibility for a serializer to limit itself to certain fields,
    selected by the query parameter 'fields', or to exclude certain fields
    with parameter 'fields!'.
    """

    # If using Django filters in the API, these labels mustn't conflict with
    # any model field names.
    include_arg_name = 'fields'
    exclude_arg_name = 'fields!'

    # Split field names by this string.  It doesn't necessarily have to be a
    # single character. Avoid RFC 1738 reserved characters i.e.
    # ';', '/', '?', ':', '@', '=' and '&'
    delimiter = ','

    def __init__(self, *args, **kwargs):
        super(QueryFieldsMixin, self).__init__(*args, **kwargs)

        try:
            request: Request = self.context['request']
            method = request.method
            query_params = request.query_params
        except (AttributeError, TypeError, KeyError):
            # The serializer was not initialized with request context.
            return

        if method not in ['GET', 'OPTIONS']:
            return

        include_field_names = {
            field
            for field in (self.delimiter
                          .join(query_params.getlist(self.include_arg_name))
                          .split(self.delimiter))
            if field}

        exclude_field_names = set(
            self.delimiter
            .join(query_params.getlist(self.exclude_arg_name))
            .split(self.delimiter)
        )

        print(include_field_names, exclude_field_names)
        if not include_field_names and not exclude_field_names:
            # No user fields filtering was requested, we have nothing to do.
            return

        serializer_field_names = set(self.fields)

        fields_to_drop = serializer_field_names & exclude_field_names
        if include_field_names:
            fields_to_drop |= serializer_field_names - include_field_names

        for field in fields_to_drop:
            self.fields.pop(field)
