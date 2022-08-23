from django.urls import path

from .views import (
    AuthView,
    LogoutView,
    RegistrationView,
    TemporaryRegistrationView,
    ConfirmUser,
    PermanentAccountUpgradeView,
    ForgottenPassView,
    PasswordResetConfirmCustomView,
    RegistrationChoice,
    redirect_to_student
)

app_name = 'account'

urlpatterns = [
    path('login/', AuthView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('registration/choice/',
         RegistrationChoice.as_view(),
         name='registration-choice'),
    path('registration/', RegistrationView.as_view(), name='registration'),
    path('registration/temporary/',
         TemporaryRegistrationView.as_view(),
         name='temporary-registration'),
    path('activate/<slug:uidb64>/<slug:token>/',
         ConfirmUser.as_view(),
         name='confirm'),
    path('permanent/',
         PermanentAccountUpgradeView.as_view(),
         name='upgrade-permanent'),
    path('forgotten/', ForgottenPassView.as_view(), name='forgotten_pass'),
    path('reset_pass/<slug:uidb64>/<slug:token>/',
         PasswordResetConfirmCustomView.as_view(),
         name='reset_pass'),
    path('<slug:user_id>/student/',
         redirect_to_student,
         name='redirect-student'),
]
