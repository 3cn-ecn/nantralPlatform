from typing import Any, Dict

from django.contrib.auth.mixins import LoginRequiredMixin
from apps.roommates.models import Housing, Roommates, NamedMembershipRoommates
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView, UpdateView, DetailView
import locale

from django.conf import settings

from apps.roommates.models import Housing


class HousingMap(LoginRequiredMixin, TemplateView):
    template_name = 'roommates/housing/map.html'

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['MAPBOX_API_KEY'] = settings.MAPBOX_API_KEY
        return context


class HousingDetailView(LoginRequiredMixin, DetailView):
    template_name = 'roommates/housing/detail.html'
    model = Housing

    def get_context_data(self, **kwargs):
        context= super().get_context_data(**kwargs)
        context['Roommates'] = Roommates.objects.filter( housing = self.object.pk).order_by('-begin_date')

        list_roommates = []
        context['roommates_groups'] = Roommates.objects.filter(housing=self.object.pk).order_by('-begin_date')
        for group in context['roommates_groups']: 
            member_list=[]
            for member in NamedMembershipRoommates.objects.filter(roommates=group.id):
                #On évite d'afficher un None si le coloc n'a pas de
                if member.nickname is None:
                    nicknm=[]
                else:
                    nicknm=member.nickname

                member_list.append({
                'first_name': member.student.first_name,
                'last_name' : member.student.last_name,
                'nickname' : nicknm,
                })
            list_roommates.append({'name': group.name, 'description' : group.description, 'begin_date': group.begin_date, 'end_date': group.end_date, 'members': member_list})
        context['roommates_groups'] = list_roommates
        
        for roommate in context['roommates_groups']:
            print(roommate['name'])
            print(roommate['begin_date'])
            for member in roommate['members']:
                print(member['first_name'])

        #On met les dates en français et au bon format.
        locale.setlocale(locale.LC_TIME,'')
        for roommate in context['roommates_groups']:
            if roommate['end_date'] is not None:
                roommate['end_date']= roommate['end_date'].strftime('%d/%m/%Y')
            roommate['begin_date']= roommate['begin_date'].strftime('%d/%m/%Y')

        return context


class CreateHousingView(LoginRequiredMixin, TemplateView):
    template_name = 'roommates/housing/create.html'


class EditHousingView(LoginRequiredMixin, UpdateView):
    template_name = 'roommates/housing/edit.html'
    model = Housing
    fields = ['details']
