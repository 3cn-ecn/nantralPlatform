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


class MembershipFamilyRoleInline(admin.TabularInline):
    model = MembershipFamily
    extra = 0
    can_add = False
    can_delete = False
    can_change = False
    fields = ["user", "role"]
    readonly_fields = ["user", "role"]
    role_filter = None

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if self.role_filter is None:
            return qs
        return qs.filter(role=self.role_filter)


class MembershipFamily1AInline(MembershipFamilyRoleInline):
    role_filter = "1A"
    verbose_name = "Membre 1A"
    verbose_name_plural = "Membres 1A"


class MembershipFamily2APlusInline(MembershipFamilyRoleInline):
    role_filter = "2A+"
    verbose_name = "Membre 2A+"
    verbose_name_plural = "Membres 2A+"


class FamilyAdmin(admin.ModelAdmin):
    inlines = [
        AnswerFamilyInline,
        MembershipFamily1AInline,
        MembershipFamily2APlusInline,
    ]


admin.site.register(Family, FamilyAdmin)


# members
class AnswerMemberInline(admin.TabularInline):
    model = AnswerMember
    extra = 0


class MembershipFamilyGroupFilter(admin.SimpleListFilter):
    title = "Association à une famille"
    parameter_name = "group_status"

    def lookups(self, request, model_admin):
        return [
            ("with_group", "Avec une famille"),
            ("without_group", "Sans famille"),
        ]

    def queryset(self, request, queryset):
        value = self.value()
        if value == "with_group":
            return queryset.filter(group__isnull=False)
        if value == "without_group":
            return queryset.filter(group__isnull=True)
        return queryset


class MembershipFamilyPromoFilter(admin.SimpleListFilter):
    title = "Promo"
    parameter_name = "promo"

    def lookups(self, request, model_admin):
        promos = (
            MembershipFamily.objects.exclude(user__promo__isnull=True)
            .values_list("user__promo", flat=True)
            .distinct()
            .order_by("user__promo")
        )
        return [(str(promo), str(promo)) for promo in promos]

    def queryset(self, request, queryset):
        value = self.value()
        if value:
            return queryset.filter(user__promo=value)
        return queryset


class MembershipFamilyAdmin(admin.ModelAdmin):
    list_display = ["user", "group", "role"]
    list_filter = [
        "role",
        "group",
        MembershipFamilyGroupFilter,
        MembershipFamilyPromoFilter,
    ]
    search_fields = [
        "user__username",
        "user__first_name",
        "user__last_name",
        "group__name",
        "group__alt_name",
    ]
    ordering = ["user__last_name", "user__first_name", "user__username"]
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
    list_display = ["code_name", "quota", "allow_custom_coef", "order"]
    inlines = [OptionInline]


class GroupQuestionAdmin(admin.ModelAdmin):
    list_display = [
        "code_name",
        "coeff",
        "order",
        "page",
    ]
    list_filter = ["page"]
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
    list_display = ["name", "order"]
    inlines = [QuestionGroupInline, QuestionMemberInline]


admin.site.register(QuestionPage, QuestionPageAdmin)
