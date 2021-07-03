from django.views.generic import FormView, View, TemplateView, UpdateView
from django.shortcuts import redirect, render
from django.contrib import messages
from django.contrib.auth.decorators import login_required

from .forms import PostForm, PostFormSet
from .models import Post

from apps.group.models import Group
from apps.group.views import GroupSlugFonctions
from apps.utils.accessMixins import UserIsAdmin, LoginRequiredAccessMixin


class PostDetailView(LoginRequiredAccessMixin, TemplateView):
    template_name = 'post/detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = Post.get_post_by_slug(self.kwargs.get('post_slug'))
        context['object'] = self.object
        context['group'] = self.object.get_group
        return context


class PostUpdateView(GroupSlugFonctions, UserIsAdmin, UpdateView):
    template_name = 'post/update.html'
    fields = ['title', 'description',
              'publication_date', 'publicity', 'color', 'image']

    def test_func(self) -> bool:
        self.kwargs['group_slug'] = self.object.get_group.slug
        return super().test_func()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = self.object.get_group
        context['post'] = self.object
        context['group_type'] = self.object.group.split('--')[0]
        context['group_slug'] = self.object.group.split('--')[1]
        return context

    def get_object(self, **kwargs):
        return Post.get_post_by_slug(self.kwargs['post_slug'])

    def dispatch(self, request, *args, **kwargs):
        self.object = Post.get_post_by_slug(self.kwargs['post_slug'])
        self.kwargs['group_slug'] = self.object.get_group.slug
        return super().dispatch(request, *args, **kwargs)


class UpdateGroupCreatePostView(GroupSlugFonctions, UserIsAdmin, FormView):
    """In the context of a group, create a post view."""
    template_name = 'group/post/create.html'
    form_class = PostForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = Group.get_group_by_slug(self.get_slug)
        context['group_type'] = self.kwargs.get('group_type')
        context['group_slug'] = self.kwargs.get('group_slug')
        return context

    def form_valid(self, form, **kwargs):
        post = form.save(commit=False)
        post.group = Group.get_group_by_slug(
            slug=self.get_slug).slug
        post.save()
        group_type = self.kwargs.get('group_type')
        group_slug = self.kwargs.get('group_slug')
        return redirect(group_type+':create-post', group_slug)


class UpdateGroupPostsView(GroupSlugFonctions, UserIsAdmin, View):
    """In the context of a group, list and update the posts."""
    template_name = 'group/post/last_30_d.html'

    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = Group.get_group_by_slug(self.get_slug)
        context['posts'] = Post.objects.filter(
            group=self.get_slug)
        context['form'] = PostFormSet(queryset=context['posts'])
        context['group_type'] = self.kwargs.get('group_type')
        context['group_slug'] = self.kwargs.get('group_slug')
        return context

    def get(self, request, group_slug, **kwargs):
        return render(request, self.template_name, context=self.get_context_data(group_slug=group_slug))

    def post(self, request,  group_slug, group_type):
        return edit_posts(request, group_slug, group_type)


@login_required
def edit_posts(request, group_slug, group_type):
    group = Group.get_group_by_slug(group_slug)
    form = PostFormSet(request.POST)
    if form.is_valid():
        posts = form.save(commit=False)
        # Link each event to the group
        for post in posts:
            post.group = group.slug
            post.save()
        # Delete  missing events
        for event in form.deleted_objects:
            post.delete()
        messages.success(request, 'Annonces  modifies')
        return redirect(group_type+':update-posts', group_slug)
    else:
        messages.warning(request, form.errors)
        return redirect(group_type+':update-posts', group_slug)
