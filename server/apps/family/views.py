from django.shortcuts import redirect, render
from django.urls.base import reverse
from django.views.generic import TemplateView, CreateView, View, DetailView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from datetime import date

from apps.utils.accessMixins import UserIsAdmin
from .models import Family, MembershipFamily, QuestionPage
from .forms import CreateFamilyForm, UpdateFamilyForm, Member2AFormset, FamilyQuestionsForm, MemberQuestionsForm
from .utils import read_phase, get_membership, is_1A, show_sensible_data


# Create your views here.

class HomeFamilyView(LoginRequiredMixin, TemplateView):
    """Page d'accueil de l'appli Parrainage"""

    template_name = 'family/home.html'

    def get_context_data(self, **kwargs):
        membership = get_membership(self.request.user)
        context = {}
        context['phase'] = read_phase()
        context['is_2Aplus'] = not is_1A(self.request.user, membership)
        if membership:
            context['registered'] = True
            context['form_complete'] = membership.form_complete()
            context['user_family'] = membership.group
            if membership.group:
                context['1A_members'] = membership.group.memberships.filter(role='1A')
                context['family_not_completed'] = membership.group.count_members2A() < 3
        return context


class ListFamilyView(LoginRequiredMixin, TemplateView):
    template_name = 'family/list.html'

    def get_context_data(self, *args, **kwargs):
        phase = read_phase()
        show_data = show_sensible_data(self.request.user)
        context = {}
        context['list_family'] = [
            {
                'name':f.name if show_data else f'Famille n°{f.id}', 
                'url':f.get_absolute_url,
                'id':f.id,
            } 
            for f in Family.objects.all()
        ]
        memberships = MembershipFamily.objects.all().select_related('student__user', 'group')
        if show_data:
            context['list_2A'] = [
                {
                    'name': m.student.alphabetical_name, 
                    'family': m.group.name,
                    'url': m.group.get_absolute_url,
                }
                for m in memberships.filter(role='2A+')
            ]
        if phase >= 3:
            context['list_1A'] = [
                {
                    'name': m.student.alphabetical_name, 
                    'family': m.group.name if show_data and phase > 3 else f'Famille n°{m.group.id}',
                    'url': m.group.get_absolute_url,
                }
                for m in memberships.filter(role='1A', group__isnull=False)
            ]
        return context



class ListFamilyJoinView(ListFamilyView):

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        for list in context:
            for object in context[list]:
                object['url'] += '/join'
        return context



class CreateFamilyView(LoginRequiredMixin, CreateView):
    """Vue pour créer une nouvelle famille"""
    template_name = 'family/family/create.html'
    form_class = CreateFamilyForm

    def can_create(self):
        return get_membership(self.request.user) is None and not is_1A(self.request.user)

    def form_valid(self, form):
        if self.can_create():
            self.object = form.save(commit=False)
            self.object.year = date.today().year
            self.object.save()
            MembershipFamily.objects.create(
                group=self.object,
                student=self.request.user.student,
                role='2A+',
                admin=True,
            )
            return redirect('family:update', self.object.pk)
        else:
            return redirect('family:create')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['can_create'] = self.can_create()
        return context
    


class DetailFamilyView(LoginRequiredMixin, DetailView):
    template_name = 'family/family/detail.html'

    def get_object(self):
        return Family.objects.get(pk=self.kwargs['pk'])
    
    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        family = self.get_object()
        context['show_name'] = show_sensible_data(self.request.user)
        context['is_admin'] = family.is_admin(self.request.user)
        context['parrains'] = family.memberships.filter(role='2A+')
        context['filleuls'] = family.memberships.filter(role='1A')
        context['phase'] = read_phase()
        return context




class JoinFamilyView(LoginRequiredMixin, DetailView):
    template_name = 'family/family/join.html'

    def get_object(self):
        return Family.objects.get(pk=self.kwargs['pk'])
        
    def can_join(self):
        return get_membership(self.request.user) is None and not is_1A(self.request.user)
    
    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        family = self.get_object()
        context['can_join'] = self.can_join()
        non_subscribed_list = family.non_subscribed_members
        if non_subscribed_list:
            context['names_list'] = non_subscribed_list.split(',')
        return context
    
    def post(self, request, *args, **kwargs):
        if self.can_join():
            family = self.get_object()
            selected_name = request.POST['member']
            names_list = family.non_subscribed_members.split(',')
            new_list = []
            for name in names_list:
                if name == selected_name:
                    MembershipFamily.objects.create(
                        student = request.user.student,
                        group = family,
                        role = '2A+',
                        admin = True,
                    )
                else:
                    new_list.append(name)
            family.non_subscribed_members = ','.join(new_list)
            family.save()
            return redirect('family:home')
        else:
            return redirect('family:join', self.get_object().pk)


class UpdateFamilyView(UserIsAdmin, TemplateView):
    template_name = 'family/family/edit.html'

    def get_family(self):
        return Family.objects.get(pk=self.kwargs['pk'])

    def test_func(self):
        self.kwargs['slug'] = self.get_family().slug
        return super().test_func()
    
    def get_context_data(self, *args, **kwargs):
        context = {}
        context['update_form'] = UpdateFamilyForm(
            instance=self.get_family())
        context['members_form'] = Member2AFormset(
            instance=self.get_family(),
            queryset=MembershipFamily.objects.filter(role='2A+'))
        context['question_form'] = FamilyQuestionsForm(
            initial = self.get_family().get_answers_dict())
        return context
    
    def post(self, request, *args, **kwargs):
        forms = [
            UpdateFamilyForm(request.POST, instance=self.get_family()),
            Member2AFormset(request.POST, instance=self.get_family(), queryset=MembershipFamily.objects.filter(role='2A+')),
            FamilyQuestionsForm(data=request.POST)]
        if forms[0].is_valid() and forms[1].is_valid() and forms[2].is_valid():
            # on vérifie le nb de membres
            non_subscribed_list = forms[0].cleaned_data['non_subscribed_members']
            if non_subscribed_list:
                nb_non_subscribed = len((non_subscribed_list).split(','))
            else:
                nb_non_subscribed = 0
            nb_subscribed = 0
            for form in forms[1]:
                if hasattr(form.instance,'student'): nb_subscribed += 1
            nb_tot = nb_subscribed + nb_non_subscribed
            if nb_tot <= 7 and nb_tot >= 3:
                # on vérifie que les membres ne sont pas déjà dans une famille
                membres_doublon = []
                for form in forms[1]:
                    if hasattr(form.instance,'student'):
                        if form.instance.student.family_set.filter(year=date.today().year).exclude(pk=self.get_family().pk):
                            membres_doublon.append(form.instance.student.alphabetical_name)
                if not membres_doublon:
                    # c'est bon on sauvegarde !
                    for form in forms[1]: 
                        form.instance.role = '2A+'
                        form.instance.admin = True
                    forms[0].save()
                    forms[1].save()
                    forms[2].save(self.get_family())
                    messages.success(request, "Les informations ont bien été enregistrées ! <a href='"+reverse("family:home")+"'>Compléter mon questionnaire perso</a>")
                    return redirect('family:update', self.get_family().pk)
                else:
                    messages.error(request, "Erreur : les membres suivants sont déjà dans une famille : "
                        + ', '.join(membres_doublon))
            else:
                messages.error(request, 'Erreur : une famille doit avoir minimum 3 membres \
                    et maximum 7 membres (vérifiez les noms du champ "Autres parrains")')
        else:
            messages.error(request, "OOOOUPS !!! Il y a une erreur...")
        context={'update_form':forms[0], 'members_form':forms[1], 'question_form':forms[2]}
        return self.render_to_response(context)




class QuestionnaryPageView(LoginRequiredMixin, FormView):
    form_class = MemberQuestionsForm
    template_name = 'family/forms/questionnary.html'

    def get_member(self):
        membership = get_membership(self.request.user)
        if membership is None:
            if is_1A(self.request.user):
                membership = MembershipFamily.objects.create(
                    student=self.request.user.student,
                    role='1A'
                )
            else:
                membership = None
        return membership
    
    def get_page(self):
        return QuestionPage.objects.get(order=self.kwargs['id'])
    
    def get_initial(self):
        self.intial = self.get_member().get_answers_dict(self.get_page())
        return self.intial
    
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs.update({
            'page': self.get_page(),
            'is_2Aplus': self.get_member().role == '2A+',
            })
        return kwargs
    
    def form_valid(self, form):
        form.save(self.get_member())
        try:
            next_page = QuestionPage.objects.get(order=self.get_page().order + 1)
            return redirect('family:questionnary', next_page.order)
        except QuestionPage.DoesNotExist:
            messages.success(self.request, "🥳 Merci beaucoup ! Vos réponses ont bien été enregistrées !")
            return redirect('family:home')
    
    def form_invalid(self, form):
        messages.error(self.request, "OOOOUPS !!! Il y a une erreur...")
        return super().form_invalid(form)
    
    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['page'] = self.get_page()
        context['percent'] = int(100*self.get_page().order/QuestionPage.objects.all().count())
        member = self.get_member()
        if member:
            context['is_2Aplus'] = member.role == '2A+'
        else:
            context['error'] = True
        return context
