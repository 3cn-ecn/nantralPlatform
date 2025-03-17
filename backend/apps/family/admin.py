from django.contrib import admin

from .models import (
    AnswerFamily,
    AnswerMember,
    Family,
    GroupQuestion,
    MembershipFamily,
    Option,
    QuestionFamily,
    QuestionMember,
    QuestionPage,
)


class AnswerFamilyInline(admin.TabularInline):
    model = AnswerFamily
    extra = 0


class MemberFamilyInline(admin.TabularInline):
    model = MembershipFamily
    extra = 0


class FamilyAdmin(admin.ModelAdmin):
    inlines = [AnswerFamilyInline]


admin.site.register(Family, FamilyAdmin)


# members
class AnswerMemberInline(admin.TabularInline):
    model = AnswerMember
    extra = 0


class MembershipFamilyAdmin(admin.ModelAdmin):
    list_display = ["__str__", "role"]
    inlines = [AnswerMemberInline]


admin.site.register(MembershipFamily, MembershipFamilyAdmin)


# questions
class OptionInline(admin.TabularInline):
    model = Option
    extra = 0


class QuestionMemberAdmin(admin.ModelAdmin):
    list_display = [
        "code_name",
        "coeff",
        "allow_custom_coef",
        "order",
        "group",
        "page",
    ]
    list_filter = ["group", "page"]
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
    model = QuestionMember
    extra = 0


class QuestionGroupInline(admin.TabularInline):
    model = GroupQuestion
    extra = 0


class QuestionPageAdmin(admin.ModelAdmin):
    inlines = [QuestionGroupInline, QuestionMemberInline]


admin.site.register(QuestionPage, QuestionPageAdmin)
