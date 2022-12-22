from django.views.generic import ListView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import resolve
from django.db.models import Q
from django.core.cache import cache
from django.core.cache.utils import make_template_fragment_key

from django.utils import timezone

from apps.club.models import Club
from apps.group.abstract.views import BaseDetailGroupView

from apps.utils.slug import get_object_from_slug


class ListClubView(TemplateView):
    template_name = 'club/list.html'

    def get_context_data(self, **kwargs):
        context = {}
        key = make_template_fragment_key('club_list')
        cached = cache.get(key)
        if cached is None:
            club_list = {}
            all_clubs = Club.objects.all().select_related(
                "bdx_type").only('name', 'slug', 'logo', 'bdx_type')
            for club in all_clubs:
                if club.bdx_type is None:
                    club_list.setdefault("Associations", []).append(club)
                else:
                    club_list.setdefault(
                        f'Clubs {club.bdx_type.name}', []).append(club)
            context['club_list'] = club_list
        context['ariane'] = [
            {
                'target': '#',
                'label': 'Clubs & Assos'
            }
        ]
        return context


class DetailClubView(BaseDetailGroupView):
    '''Vue de détails d'un club.'''

    template_name = 'club/detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        group = context['object']
        date_end = timezone.make_aware(timezone.now().today())
        context['members'] = group.members.through.objects.filter(
            Q(group=group)
            & (Q(date_end__isnull=True) | Q(date_end__gt=date_end))
        ).order_by('student__user__first_name')
        return context


class DetailGroupMembersView(LoginRequiredMixin, ListView):
    template_name = 'club/members.html'

    def get_object(self, **kwargs):
        app = resolve(self.request.path).app_name
        slug = self.kwargs.get("slug")
        return get_object_from_slug(app, slug)

    def get_queryset(self, **kwargs):
        object = self.get_object()
        members = object.members.through.objects.filter(group=object)
        return members.order_by('year', 'order')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = self.get_object()
        return context
