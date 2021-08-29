from django.shortcuts import redirect, render
from django.urls.base import reverse
from django.views.generic import TemplateView, CreateView, View, DetailView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.db.models import Count
from django.db.models import Q
from datetime import date

from apps.utils.accessMixins import UserIsInGroup
from .models import Family, MembershipFamily, QuestionFamily, QuestionPage
from .utils import read_phase
from .algorithm import main_algorithm, save


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

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        member1A_list, member2A_list, family_list = main_algorithm()
        context['member1A_list'] = member1A_list
        families = []
        for f in family_list:
            members_2A = [m['member'] for m in member2A_list if m['family']==f['family']]
            members_1A = [m['member'] for m in member1A_list if m['family']==f['family']]
            families.append({'A1':members_1A, 'A2':members_2A, 'family':f})
        context['families'] = families
        return context