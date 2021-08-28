from django.shortcuts import redirect, render
from django.urls.base import reverse
from django.views.generic import TemplateView, CreateView, View, DetailView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from datetime import date

from apps.utils.accessMixins import UserIsFamilyAdmin
from .models import Family, MembershipFamily, QuestionPage
from .forms import CreateFamilyForm, UpdateFamilyForm, Member2AFormset, FamilyQuestionsForm, MemberQuestionsForm
from .utils import *


# Create your views here.

class HomeAdminView(UserIsFamilyAdmin, TemplateView):
    pass