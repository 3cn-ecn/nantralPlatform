from django.shortcuts import redirect
from django.views.generic import TemplateView
from django.db.models import Q
from django.core.cache import cache
from django.contrib import messages
from datetime import date

from apps.utils.accessMixins import UserIsInGroup
from .models import Family, MembershipFamily, QuestionFamily
from .utils import read_phase
from .algorithm import main_algorithm, save, reset


GROUP_NAME = 'admin-family'


class HomeAdminView(UserIsInGroup, TemplateView):
    group = GROUP_NAME
    template_name = 'family/admin/home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['phase'] = read_phase()
        # family - general
        families = Family.objects.filter(year=date.today().year)
        nb_fquestion = QuestionFamily.objects.all().count()
        context['nb_families'] = len(families)
        # family - bad number of members
        bad_nb_families = [f for f in families if f.count_members2A()<3]
        context['bad_nb_families'] = bad_nb_families
        context['nb_bad_nb_families'] = len(bad_nb_families)
        # family - bad number of answers
        bad_ans_families = [f for f in families if len(f.get_answers_dict()) != nb_fquestion]
        context['bad_ans_families'] = bad_ans_families
        context['nb_bad_ans_families'] = len(bad_ans_families)
        # members
        members = MembershipFamily.objects.filter(Q(group__isnull=True) | Q(group__year=date.today().year))
        members1A = members.filter(role='1A')
        members2A = members.filter(role='2A+')
        non_complete_1A = [m for m in members1A if not m.form_complete()]
        non_complete_2A = [m for m in members2A if not m.form_complete()]
        context['non_complete_1A'] = non_complete_1A
        context['nb_non_complete_1A'] = len(non_complete_1A)
        context['non_complete_2A'] = non_complete_2A
        context['nb_non_complete_2A'] = len(non_complete_2A)
        # membres non inscrits
        non_subscribed_2A = []
        for f in families:
            for m in f.non_subscribed_members.split(','):
                if m: non_subscribed_2A.append((m, f))
        context['non_subscribed_2A'] = non_subscribed_2A
        context['nb_non_subscribed_2A'] = len(non_subscribed_2A)
        return context



class ResultsView(UserIsInGroup, TemplateView):
    group = GROUP_NAME
    template_name = 'family/admin/results.html'

    def post(self, request, *args, **kwargs):
        if request.POST['action_family'] == 'save':
            member1A_list = cache.get('member1A_list')
            if member1A_list: 
                save(member1A_list)
                messages.success(request, "Résultats sauvegardés !")
                return redirect('family-admin:results-saved')
            else:
                messages.error(request, "Les résultats ont été perdus, désolé !")
        return redirect('family-admin:home')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        families = []
        try:
            member1A_list, member2A_list, family_list = main_algorithm()
            cache.set('member1A_list', member1A_list, 3600)
            for f in family_list:
                members_2A = [m['member'] for m in member2A_list if m['family']==f['family']]
                members_1A = [m['member'] for m in member1A_list if m['family']==f['family']]
                if members_2A or members_1A: families.append({'A1':members_1A, 'A2':members_2A, 'family':f['family']})
        except Exception as e:
            messages.error(self.request, e)
        context['families'] = families
        return context


class ResultsSavedView(UserIsInGroup, TemplateView):
    group = GROUP_NAME
    template_name = 'family/admin/results_saved.html'

    def post(self, request, *args, **kwargs):
        if request.POST['action_family'] == 'reset':
            reset()
        return redirect('family-admin:home')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        families = []
        for f in Family.objects.filter(year=date.today().year):
            members_2A = f.memberships.filter(role='2A+')
            members_2A_plus = f.non_subscribed_members.split(',') if f.non_subscribed_members else []
            members_1A = f.memberships.filter(role='1A')
            families.append({'A1':members_1A, 'A2':members_2A, 'A2plus':members_2A_plus, 'family':f})
        context['families'] = families
        return context

