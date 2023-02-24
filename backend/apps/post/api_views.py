from rest_framework import generics, permissions
from rest_framework import viewsets
from .models import Post
from .serializers import PostSerializer
from rest_framework.response import Response


class ListPostsAPIView(viewsets.ViewSet):
    """List all current posts."""
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        queryset = Post.objects.all()
        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)


class ListPostsGroupAPIView(generics.ListAPIView):
    """List posts in the context of a group."""
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.method == 'GET':
            return Post.objects.filter(group=self.kwargs['group'])


class UpdatePostAPIView(generics.RetrieveDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PostSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'post_slug'

    def get_queryset(self):
        return Post.objects.filter(slug=self.kwargs['post_slug'])
