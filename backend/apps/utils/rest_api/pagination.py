from collections import OrderedDict

from rest_framework import pagination, response, settings


class CustomPagination(pagination.PageNumberPagination):
    page_size = settings.api_settings.PAGE_SIZE
    page_query_param = "page"
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):
        return response.Response(
            OrderedDict(
                [
                    ("count", self.page.paginator.count),
                    ("num_pages", self.page.paginator.num_pages),
                    ("next", self.get_next_link()),
                    ("previous", self.get_previous_link()),
                    ("results", data),
                ]
            )
        )
