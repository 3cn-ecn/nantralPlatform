from typing import Any, Dict

from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect
from django.urls import reverse
from django.conf import settings
from django.views.generic import TemplateView, CreateView, ListView, UpdateView

from extra_settings.models import Setting
from apps.utils.accessMixins import UserIsMember
from apps.group.views import UpdateGroupView, DetailGroupView

from .models import Housing, Roommates
from .forms import UpdateHousingForm


class HousingMap(LoginRequiredMixin, TemplateView):
    template_name = 'roommates/map.html'

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['MAPBOX_API_KEY'] = settings.MAPBOX_API_KEY
        PHASE_COLOCATHLON = Setting.get(
            'PHASE_COLOCATHLON', default=0)
        context['colocathlon'] = PHASE_COLOCATHLON
        if PHASE_COLOCATHLON == 2:
            roommate = Roommates.objects.filter(
                colocathlon_participants=self.request.user.student)
            if roommate.exists():
                context['CURRENT_COLOC'] = roommate.first().name
                context['CURRENT_COLOC_URL'] = roommate.first().get_absolute_url()
        return context


class HousingList(LoginRequiredMixin, ListView):
    model = Housing
    template_name = 'roommates/list.html'


class CreateHousingView(LoginRequiredMixin, TemplateView):
    template_name = 'roommates/create/create-housing.html'


class CreateRoommatesView(LoginRequiredMixin, CreateView):
    template_name = 'roommates/create/create-roommates.html'
    model = Roommates
    fields = ['name', 'begin_date', 'end_date']

    def form_valid(self, form):
        form.instance.housing = Housing.objects.get(
            pk=self.kwargs['housing_pk'])
        roommates = form.save()
        roommates.members.add(self.request.user.student)
        member = roommates.members.through.objects.get(
            student=self.request.user.student,
            group=roommates
        )
        member.admin = True
        member.save()
        return redirect('roommates:detail', roommates.slug)


class ColocathlonFormView(UserIsMember, UpdateView):
    template_name = 'roommates/coloc/edit/colocathlon.html'
    model = Roommates
    fields = ['colocathlon_agree', 'colocathlon_quota',
              'colocathlon_hours', 'colocathlon_activities']


class DetailRoommatesView(DetailGroupView):
    '''Vue de détails d'une coloc.'''
    template_name = 'roommates/coloc/detail/detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['housing'] = self.object.housing
        context['roommates_list'] = Roommates.objects.filter(
            housing=context['housing']
        ).exclude(pk=self.object.pk).order_by('-begin_date')
        context['colocathlon'] = Setting.get('PHASE_COLOCATHLON', default=0)
        context['nb_participants'] = self.object.colocathlon_participants.count()
        return context


class UpdateRoommatesView(UpdateGroupView):
    '''Vue pour modifier les infos générales sur une coloc.'''

    template_name = 'roommates/coloc/edit/update.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form_housing'] = UpdateHousingForm(
            instance=context['object'].housing)
        return context

    def post(self, request, **kwargs):
        group = self.get_object()
        form_housing = UpdateHousingForm(
            request.POST, request.FILES, instance=group.housing)
        form_housing.save()
        return super().post(request, **kwargs)
