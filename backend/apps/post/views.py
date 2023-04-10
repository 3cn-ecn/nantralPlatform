from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.shortcuts import get_object_or_404
from django.urls.base import reverse, reverse_lazy
from django.views.generic import (
    DetailView, UpdateView, DeleteView, CreateView)

from apps.group.models import Group
from apps.notification.models import SentNotification

from .models import Post


class PostDetailView(LoginRequiredMixin, DetailView):
    template_name = 'post/detail.html'
    model = Post
    slug_field = 'slug'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        post: Post = self.object
        # mark it as read
        SentNotification.objects.filter(
            student=self.request.user.student,
            notification=post.notification
        ).update(seen=True)
        # get context
        context['group'] = post.group
        context['is_admin'] = post.group.is_admin(self.request.user)
        context['ariane'] = [
            {
                'target': reverse('home:home'),
                'label': "Posts"
            },
            {
                'target': '#',
                'label': post.title
            },
        ]
        return context


class PostUpdateView(UserPassesTestMixin, UpdateView):
    """Update a post."""
    template_name = 'post/update.html'
    fields = ['title', 'description', 'created_at',
              'publicity', 'color', 'image']
    model = Post
    slug_field = 'pk'

    def test_func(self) -> bool:
        post = self.get_object()
        return post.group.is_admin(self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': reverse('home:home'),
                'label': "Posts"
            },
            {
                'target': self.object.get_absolute_url(),
                'label': self.object.title
            },
            {
                'target': '#',
                'label': "Modifier"
            }
        ]
        return context


class PostDeleteView(UserPassesTestMixin, DeleteView):
    """Delete a post"""

    template_name = 'post/delete.html'
    model = Post
    slug_field = 'slug'
    success_url = reverse_lazy('home:home')

    def test_func(self) -> bool:
        post = self.get_object()
        return post.group.is_admin(self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': reverse('home:home'),
                'label': "Posts"
            },
            {
                'target': self.object.get_absolute_url(),
                'label': self.object.title
            },
            {
                'target': '#',
                'label': "Supprimer"
            }
        ]
        return context


class PostCreateView(UserPassesTestMixin, CreateView):
    """Create a post"""

    template_name = 'post/create.html'
    fields = ['title', 'description', 'created_at',
              'publicity', 'color', 'image']
    model = Post

    def test_func(self) -> bool:
        group = get_object_or_404(Group, slug=self.kwargs['group'])
        return group.is_admin(self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': reverse('home:home'),
                'label': "Posts"
            },
            {
                'target': '#',
                'label': "Créer"
            }
        ]
        return context

    def form_valid(self, form):
        form.instance.group_slug = self.kwargs['group']
        return super().form_valid(form)
