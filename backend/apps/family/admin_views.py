from django.shortcuts import redirect
from django.views.generic import TemplateView
from django.db.models import Q
from django.contrib import messages

from apps.utils.accessMixins import UserIsInGroup
from .models import Family, MembershipFamily, QuestionFamily
from .utils import read_phase, scholar_year
from .algorithm.main import main_algorithm
from .algorithm.delta import delta_algorithm
from .algorithm.itii import itii_algorithm, reset_itii
from .algorithm.utils import reset

# group of users who have access
GROUP_NAME = 'admin-family'


class HomeAdminView(UserIsInGroup, TemplateView):
    group = GROUP_NAME
    template_name = 'family/admin/home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['phase'] = read_phase()
        ## FAMILIES
        # family - general
        families = Family.objects.filter(year=scholar_year())
        context['nb_families'] = len(families)
        # family - bad number of members
        bad_nb_families = [f for f in families if f.count_members2A()<3]
        context['bad_nb_families'] = bad_nb_families
        context['nb_bad_nb_families'] = len(bad_nb_families)
        # family - not finish to complete all answers
        non_completed_families = [f for f in families if not f.form_complete()]
        context['nb_non_complete_families'] = len(non_completed_families)
        if context['nb_non_complete_families'] < 10:
            context['non_complete_families'] = non_completed_families
        ## MEMBERS
        members = MembershipFamily.objects.filter(Q(group__isnull=True) | Q(group__year=scholar_year())).order_by('group__name')
        ## MEMBERS 1A
        members1A = members.filter(role='1A')
        context['nb_1A'] = members1A.count()
        context['nb_itii'] = members1A.filter(student__faculty='Iti').count()
        context['nb_1A_unplaced'] = members1A.filter(group__isnull=True).count()
        context['nb_1A_placed'] = members1A.filter(group__isnull=False).count()
        # 1A pas encore dans une famille
        if context['nb_1A_unplaced'] < 10:
            context['unplaced_1A'] = members1A.filter(group__isnull=True)
        # 1A n'ayant pas fini le questionnaire
        non_complete_1A = [m for m in members1A if not m.form_complete()]
        context['nb_non_complete_1A'] = len(non_complete_1A)
        context['non_complete_1A'] = non_complete_1A
        ## MEMBERS 2A+
        members2A = members.filter(role='2A+')
        context['nb_2A'] = members2A.count()
        # 2A n'ayant pas fini leur questionnaire
        non_complete_2A = [m for m in members2A if not m.form_complete()]
        context['non_complete_2A'] = non_complete_2A
        context['nb_non_complete_2A'] = len(non_complete_2A)
        # membres non inscrits
        non_subscribed_2A = []
        for f in families:
            if f.non_subscribed_members:
                for m in f.non_subscribed_members.split(','):
                    if m: non_subscribed_2A.append((m, f))
        context['non_subscribed_2A'] = non_subscribed_2A
        context['nb_non_subscribed_2A'] = len(non_subscribed_2A)
        return context



class ResultsView(UserIsInGroup, TemplateView):
    group = GROUP_NAME
    template_name = 'family/admin/results.html'

    def post(self, request, *args, **kwargs):
        if request.POST['action_family'] == 'reset':
            reset()
        return redirect('family-admin:home')
    
    def resolve(self):
        if MembershipFamily.objects.filter(role='1A', group__year=scholar_year()).exists():
            raise Exception('Some 1A members are already placed in families this year. The algorithm has already been executed!')
        return main_algorithm()
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        families = []
        try:
            member1A_list, member2A_list, family_list = self.resolve()
            for f in family_list:
                members_2A = [m for m in member2A_list if m['family']==f['family']]
                members_1A = [m for m in member1A_list if m['family']==f['family']]
                if members_2A or members_1A: families.append({'A1':members_1A, 'A2':members_2A, 'family':f['family']})
        except Exception as e:
            messages.error(self.request, e)
        context['families'] = families
        context['phase'] = read_phase()
        return context



class ResultsDeltasView(ResultsView):
    """View for adding 1A member in late"""

    def resolve(self):
        return delta_algorithm()


class ResultsItiiView(ResultsView):
    """View for itii results"""

    def post(self, request, *args, **kwargs):
        if request.POST['action_family'] == 'reset':
            reset_itii()
        return redirect('family-admin:home')
    
    def resolve(self):
        return itii_algorithm()


class ResultsSavedView(UserIsInGroup, TemplateView):
    group = GROUP_NAME
    template_name = 'family/admin/results_saved.html'

    def post(self, request, *args, **kwargs):
        if request.POST['action_family'] == 'reset':
            reset()
        elif request.POST['action_family'] == 'reset_itii':
            reset_itii()
        return redirect('family-admin:home')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        families = []
        for f in Family.objects.filter(year=scholar_year()):
            members_2A = f.memberships.filter(role='2A+')
            members_2A_plus = f.non_subscribed_members.split(',') if f.non_subscribed_members else []
            members_1A = f.memberships.filter(role='1A')
            families.append({'A1':members_1A, 'A2':members_2A, 'A2plus':members_2A_plus, 'family':f})
        context['families'] = families
        context['phase'] = read_phase()
        return context
