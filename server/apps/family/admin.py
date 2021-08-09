from django.contrib import admin
from .models import *

# Register your models here.


#familles
class AnswerFamilyInline(admin.TabularInline):
    model=AnswerFamily
    extra=0
class FamilyAdmin(admin.ModelAdmin):
    inlines=[AnswerFamilyInline]
admin.site.register(Family, FamilyAdmin)


#members
class AnswerMemberInline(admin.TabularInline):
    model=AnswerMember
    extra=0
class MembershipFamilyAdmin(admin.ModelAdmin):
    inlines=[AnswerMemberInline]
    raw_id_fields = ("student",)
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

admin.site.register(QuestionPage)
admin.site.register(Affichage)

