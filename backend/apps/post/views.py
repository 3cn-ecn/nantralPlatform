from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect, render
from django.urls import resolve
from django.urls.base import reverse
from django.views.decorators.http import require_http_methods
from django.views.generic import FormView, View, TemplateView, UpdateView

from .forms import PostForm, PostFormSet
from .models import Post

from apps.notification.models import SentNotification
from apps.utils.slug import (
    get_app_from_full_slug,
    get_full_slug_from_slug,
    get_slug_from_full_slug,
    get_object_from_full_slug,
    get_object_from_slug)
from apps.utils.accessMixins import UserIsAdmin

# Application Post


class PostDetailView(LoginRequiredMixin, TemplateView):
    template_name = 'post/detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # get the post
        self.object = Post.get_post_by_slug(self.kwargs.get('post_slug'))
        # mark it as read
        SentNotification.objects.filter(
            student=self.request.user.student,
            notification=self.object.notification
        ).update(seen=True)
        # get context
        context['object'] = self.object
        context['group'] = self.object.get_group
        context['ariane'] = [
            {
                'target': reverse('home:home'),
                'label': "Posts"
            },
            {
                'target': '#',
                'label': self.object.title
            },
        ]
        return context


class PostUpdateView(UserIsAdmin, UpdateView):
    """Update a post."""
    template_name = 'post/update.html'
    fields = ['title', 'description',
              'publication_date', 'publicity', 'color', 'image']

    def test_func(self) -> bool:
        self.request.path = '/' + \
            get_app_from_full_slug(self.object.group) + '/'
        self.kwargs['slug'] = get_slug_from_full_slug(self.object.group)
        return super().test_func()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['post'] = self.object
        context['object'] = get_object_from_full_slug(self.object.group)
        return context

    def get_object(self, **kwargs):
        return Post.get_post_by_slug(self.kwargs['post_slug'])

    def dispatch(self, request, *args, **kwargs):
        self.object = Post.get_post_by_slug(self.kwargs['post_slug'])
        self.kwargs['slug'] = get_slug_from_full_slug(self.object.group)
        return super().dispatch(request, *args, **kwargs)


# Application Group

class UpdateGroupCreatePostView(UserIsAdmin, FormView):
    """In the context of a group, create a post view."""
    template_name = 'group/edit/post/create.html'
    form_class = PostForm

    def get_app(self, **kwargs):
        return resolve(self.request.path).app_name

    def get_slug(self, **kwargs):
        return self.kwargs.get("slug")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = group = get_object_from_slug(
            self.get_app(), self.get_slug())
        context['ariane'] = [{'target': reverse(group.app + ':index'),
                              'label': group.app_name},
                             {'target': reverse(group.app + ':detail',
                                                kwargs={'slug': group.slug}),
                              'label': group.name},
                             {'target': '#',
                              'label': 'Modifier'}]
        return context

    def form_valid(self, form, **kwargs):
        post = form.save(commit=False)
        post.group = get_full_slug_from_slug(self.get_app(), self.get_slug())
        post.save()
        messages.success(self.request, 'Votre annonce a été enregistrée.')
        return redirect(self.get_app() + ':update-posts', self.get_slug())


class UpdateGroupPostsView(UserIsAdmin, View):
    """In the context of a group, list and update the posts."""
    template_name = 'group/edit/post/last_30_d.html'

    def get_app(self, **kwargs):
        return resolve(self.request.path).app_name

    def get_slug(self, **kwargs):
        return self.kwargs.get("slug")

    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = group = get_object_from_slug(
            self.get_app(), self.get_slug())
        context['posts'] = Post.objects.filter(
            group=get_full_slug_from_slug(self.get_app(), self.get_slug()))
        context['form'] = PostFormSet(queryset=context['posts'])
        context['ariane'] = [{'target': reverse(group.app + ':index'),
                              'label': group.app_name},
                             {'target': reverse(group.app + ':detail',
                                                kwargs={'slug': group.slug}),
                              'label': group.name},
                             {'target': '#',
                              'label': 'Modifier'}]
        return context

    def get(self, request, **kwargs):
        context = self.get_context_data()
        return render(request, self.template_name, context)

    def post(self, request, **kwargs):
        object = get_object_from_slug(self.get_app(), self.get_slug())
        return edit_posts(request, object)


@require_http_methods(['POST'])
@login_required
def edit_posts(request, group):
    form = PostFormSet(request.POST)
    if form.is_valid():
        posts = form.save(commit=False)
        # Link each event to the group
        for post in posts:
            post.group = group.full_slug
            post.save()
        # Delete  missing events
        for event in form.deleted_objects:
            post.delete()
        messages.success(request, 'Annonces modifiées')
    else:
        messages.error(request, form.errors)
    return redirect(group.app + ':update-posts', group.slug)
