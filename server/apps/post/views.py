from django.views.generic import FormView, View, TemplateView, UpdateView
from django.shortcuts import redirect, render
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.urls import resolve
from django.contrib.auth.mixins import LoginRequiredMixin

from .forms import PostForm, PostFormSet
from .models import Post

from apps.utils.slug import *
from apps.utils.accessMixins import UserIsAdmin

# Application Post

class PostDetailView(LoginRequiredMixin, TemplateView):
    template_name = 'post/detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = Post.get_post_by_slug(self.kwargs.get('post_slug'))
        context['object'] = self.object
        context['group'] = self.object.get_group
        return context


class PostUpdateView(UserIsAdmin, UpdateView):
    """Update a post."""
    template_name = 'post/update.html'
    fields = ['title', 'description',
              'publication_date', 'publicity', 'color', 'image']

    def test_func(self) -> bool:
        self.request.path = '/' + get_app_from_full_slug(self.object.group) + '/'
        self.kwargs['slug']  = get_slug_from_full_slug(self.object.group)
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
        self.kwargs['slug']  = get_slug_from_full_slug(self.object.group)
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
        context['object'] = get_object_from_slug(self.get_app(), self.get_slug())
        return context

    def form_valid(self, form, **kwargs):
        post = form.save(commit=False)
        post.group = get_full_slug_from_slug(self.get_app(), self.get_slug())
        post.save()
        return redirect(self.get_app()+':create-post', self.get_slug())


class UpdateGroupPostsView(UserIsAdmin, View):
    """In the context of a group, list and update the posts."""
    template_name = 'group/edit/post/last_30_d.html'

    def get_app(self, **kwargs):
        return resolve(self.request.path).app_name
    def get_slug(self, **kwargs):
        return self.kwargs.get("slug")
    
    def get_context_data(self, **kwargs):
        context = {}
        context['object'] = get_object_from_slug(self.get_app(), self.get_slug())
        context['posts'] = Post.objects.filter(
            group=get_full_slug_from_slug(self.get_app(), self.get_slug()))
        context['form'] = PostFormSet(queryset=context['posts'])
        return context

    def get(self, request, **kwargs):
        context=self.get_context_data()
        return render(request, self.template_name, context)

    def post(self, request,  **kwargs):
        object = get_object_from_slug(self.get_app(), self.get_slug())
        return edit_posts(request, object)


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
        messages.success(request, 'Annonces  modifiées')
    else:
        messages.warning(request, form.errors)
    return redirect(group.app+':update-posts', group.slug)
