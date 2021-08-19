from django.shortcuts import redirect, render
from django.views.generic import TemplateView, CreateView, UpdateView, DetailView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from datetime import date

from apps.utils.accessMixins import UserIsAdmin
from .models import Affichage, QuestionMember, QuestionFamily, AnswerMember, Family, MembershipFamily, QuestionPage
from .forms import CreateFamilyForm, UpdateFamilyForm, Member2AFormset, FamilyQuestionsForm, MemberQuestionsForm


# Create your views here.

class HomeFamilyView(LoginRequiredMixin, TemplateView):
    """Page d'accueil de l'appli Parrainage"""

    template_name = 'family/home.html'

    def get_context_data(self, **kwargs):
        student = self.request.user.student
        phase = Affichage.objects.first().phase
        context = {}
        context['phase'] = phase
        context['user_family'] = student.family_set.filter(year=date.today().year).first()
        if context['user_family']:
            context['is_2Aplus'] = (context['user_family'].memberships.filter(student=student).first().role == '2A+')
            context['1A_members'] = context['user_family'].memberships.filter(role='1A')
        else:
            context['is_2Aplus'] = (student.promo < date.today().year)
            context['1A_members'] = None
        # nombre de questions complétées
        nb_done = AnswerMember.objects.filter(member__student=student).count()
        nb_tot = QuestionMember.objects.all().count()
        nb_fam_only = QuestionFamily.objects.filter(quota=100).count()
        context['form_complete'] = (nb_done >= (nb_tot - nb_fam_only*int(context['is_2Aplus'])))

        return context


class ListFamilyView(LoginRequiredMixin, TemplateView):
    template_name = 'family/list.html'

    def get_context_data(self, *args, **kwargs):
        phase = Affichage.objects.first().phase
        try:
            first_year = True
            for membership in self.request.user.student.membershipfamily.all():
                if membership.role == '2A+':
                    first_year = False
        except MembershipFamily.DoesNotExist:
            first_year = self.request.user.student.promo == date.today().year
        show_name = (not first_year) or (phase >= 3)
        context = {}
        context['list_family'] = [
            {
                'name':f.name if show_name else f'Famille n°{f.id}', 
                'url':f.get_absolute_url,
            } 
            for f in Family.objects.all()
        ]
        if show_name:
            context['list_2A'] = [
                {
                    'name': m.student.alphabetical_name, 
                    'family': m.group.name,
                    'url': m.group.get_absolute_url,
                }
                for m in MembershipFamily.objects.filter(role='2A+')  
            ]
        if phase >= 2:
            context['list_1A'] = [
                {
                    'name': m.student.alphabetical_name, 
                    'family': m.group.name if show_name else f'Famille n°{m.group.id}',
                    'url': m.group.get_absolute_url,
                }
                for m in MembershipFamily.objects.filter(role='1A')  
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

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.year = date.today().year
        self.object.save()
        MembershipFamily.objects.create(
            group=self.object,
            student=self.request.user.student,
            role='2A+'
        )
        return redirect('family:update', self.object.pk)
    


class DetailFamilyView(LoginRequiredMixin, DetailView):
    template_name = 'family/family/detail.html'

    def get_object(self):
        return Family.objects.get(pk=self.kwargs['pk'])
    
    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        phase = Affichage.objects.first().phase
        family = self.get_object()
        try:
            first_year = True
            for membership in self.request.user.student.membershipfamily.all():
                if membership.role == '2A+':
                    first_year = False
        except MembershipFamily.DoesNotExist:
            first_year = self.request.user.student.promo == date.today().year
        context['show_name'] = (not first_year) or (phase >= 3)
        context['is_admin'] = family.is_admin(self.request.user)
        context['parrains'] = family.memberships.filter(role='2A+')
        context['filleuls'] = family.memberships.filter(role='1A')
        return context




class JoinFamilyView(LoginRequiredMixin, DetailView):
    template_name = 'family/family/join.html'

    def get_object(self):
        return Family.objects.get(pk=self.kwargs['pk'])
    
    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        phase = Affichage.objects.first().phase
        family = self.get_object()
        try:
            first_year = True
            for membership in self.request.user.student.membershipfamily.all():
                if membership.role == '2A+':
                    first_year = False
        except MembershipFamily.DoesNotExist:
            first_year = self.request.user.student.promo == date.today().year
        context['show_name'] = (not first_year) or (phase >= 3)
        context['is_member'] = self.request.user.student.family_set.filter(year=date.today().year).count() > 0
        context['names_list'] = family.non_subscribed_members.split(',')
        return context
    
    def post(self, request, *args, **kwargs):
        family = self.get_object()
        student = request.user.student
        selected_name = request.POST['member']
        names_list = family.non_subscribed_members.split(',')
        new_list = []
        print(selected_name)
        for name in names_list:
            print(name)
            if name == selected_name:
                MembershipFamily.objects.create(
                    student = student,
                    group = family,
                    role = '2A+',
                    admin = True,
                )
            else:
                new_list.append(name)
        family.non_subscribed_members = ','.join(new_list)
        family.save()
        return redirect('family:home')


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
                    messages.success(request, "Les informations ont bien été enregistrées !")
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
    template_name = 'family/questionnary.html'

    def get_member(self):
        student = self.request.user.student
        year = date.today().year
        try:
            member = MembershipFamily.objects.get(
                student = student,
                role = '2A+',
                group__year = year,
            )
        except MembershipFamily.DoesNotExist:
            member = MembershipFamily.objects.get_or_create(
                student=student,
                role='1A'
            )[0]
        return member
    
    def get_page(self):
        return QuestionPage.objects.get(order=self.kwargs['id'])
    
    def get_initial(self):
        print(self.get_member())
        self.intial = self.get_member().get_answers_dict(self.get_page())
        return self.intial
    
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs.update({
            'page': self.get_page(),
            'is_2Aplus': self.get_member().role == '2A+'
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
        context['is_2Aplus'] = self.get_member().role == '2A+'
        return context

    
