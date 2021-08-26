from django.contrib import admin
from typing import List
from datetime import date
from django.template.response import TemplateResponse
from django.urls.conf import path
from django.urls.resolvers import URLPattern
from .models import *
from django.db.models import Count


# Register your models here.


#familles
class AnswerFamilyInline(admin.TabularInline):
    model=AnswerFamily
    extra=0

class MemberFamilyInline(admin.TabularInline):
    model=MembershipFamily
    extra=0

class FamilyAdmin(admin.ModelAdmin):
    inlines=[MemberFamilyInline, AnswerFamilyInline]

    def get_urls(self) -> List[URLPattern]:
        urls = super().get_urls()
        customUrls = [
            path('more_actions/', self.admin_site.admin_view(self.more_actions),
                 name='more_actions')
        ]
        return customUrls + urls

    def more_actions(self, request):
        context = {}
        families = Family.objects.filter(year=date.today().year)
        solo_families = families.annotate(num_answer=Count('members')).filter(num_answer = 1)
        context['nb_family'] = families.count()
        context['nb_solo_family'] = solo_families.count()
        context['solo_family'] = solo_families
        context['phase'] = Affichage.objects.all().first().phase
        return TemplateResponse(request=request, template='admin/family/more_actions.html', context=context)

admin.site.register(Family, FamilyAdmin)


#members
class AnswerMemberInline(admin.TabularInline):
    model=AnswerMember
    extra=0
class MembershipFamilyAdmin(admin.ModelAdmin):
    inlines=[AnswerMemberInline]
admin.site.register(MembershipFamily, MembershipFamilyAdmin)


# questions
class OptionInline(admin.TabularInline):
    model = Option
    extra=0
class QuestionMemberAdmin(admin.ModelAdmin):
    inlines = [OptionInline]
class QuestionFamilyAdmin(admin.ModelAdmin):
    inlines = [OptionInline]
class GroupQuestionAdmin(admin.ModelAdmin):
    inlines = [OptionInline]
admin.site.register(QuestionMember, QuestionMemberAdmin)
admin.site.register(QuestionFamily, QuestionFamilyAdmin)
admin.site.register(GroupQuestion, GroupQuestionAdmin)

# pages
class QuestionMemberInline(admin.TabularInline):
    model=QuestionMember
    extra=0
class QuestionGroupInline(admin.TabularInline):
    model=GroupQuestion
    extra=0
class QuestionPageAdmin(admin.ModelAdmin):
    inlines=[QuestionGroupInline, QuestionMemberInline]
admin.site.register(QuestionPage, QuestionPageAdmin)


admin.site.register(Affichage)

