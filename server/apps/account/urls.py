from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'account'

urlpatterns = [
    url('login', AuthView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('registration', RegistrationView.as_view(), name='registration'),
    path('registration/temporary/<int:id>/approve', ApproveTemporaryRegistrationView.as_view(),
         name='temp-req-approve'),
    path('registration/temporary/<int:id>/deny', DenyTemporaryRegistrationView.as_view(),
         name='temp-req-deny'),
    path('registration/temporary', TemporaryRegistrationView.as_view(),
         name='temporary-registration'),
    path('activate/<slug:uidb64>/<slug:token>/',
         ConfirmUser.as_view(), name='confirm'),
    path('activate/<slug:uidb64>/<slug:token>/temporary',
         ConfirmUserTemporary.as_view(), name='confirm-temporary'),
    url('forgotten', ForgottenPassView.as_view(), name='forgotten_pass'),
    path('reset_pass/<slug:uidb64>/<slug:token>',
         PasswordResetConfirmCustomView.as_view(), name='reset_pass'),
    path('<slug:user_id>/student', redirect_to_student, name='redirect-student'),
]
