from datetime import datetime
from rest_framework import generics

from .models import Post
from .serializers import PostSerializer


class ListPostsGroupAPIView(generics.ListAPIView):
    """List posts in the context of a group."""
    serializer_class = PostSerializer

    def get_queryset(self):
        if self.request.GET:
            if self.request.GET.get('view') == 'archives':
                return Post.objects.filter(group=self.kwargs['group'], date__lt=datetime.today())
            elif self.request.get('view') == 'all':
                return Post.objects.filter(group=self.kwargs['group'])
            return Post.objects.filter(group=self.kwargs['group'])
