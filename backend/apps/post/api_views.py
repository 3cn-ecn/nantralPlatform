from rest_framework import generics, permissions

from .models import Post
from .serializers import PostSerializer
from rest_framework.response import Response
from django.utils import timezone


class ListPostsAPIView(viewsets.ViewSet):
    """List all current posts."""
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        today = timezone.now()
        queryset = Post.objects.filter(
            publication_date__lte=today).order_by("-publication_date")
        queryset = [p for p in queryset if p.can_view(request.user)]
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

    def delete(self, request, *args, **kwargs):
        post = Post.objects.filter(slug=self.kwargs['post_slug'])
        if post[0].group.is_admin(self.request.user):
            return super().delete(request, *args, **kwargs)
        return Response(status=404)

    def get_queryset(self):
        # post = get_object_or_404(
        #     Post, slug=self.kwargs['post_slug'])
        # print(post.title)
        post = Post.objects.filter(slug=self.kwargs['post_slug'])
        if (post[0].can_view(self.request.user)):
            return post
