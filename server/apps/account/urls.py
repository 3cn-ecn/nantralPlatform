from django.conf.urls import url
from django.urls import path

from .views import *

app_name = 'account'

urlpatterns = [
    url('login', AuthView.as_view(), name='login'),
    url('logout', LogoutView.as_view(), name='logout'),
    url('registration/$', RegistrationView.as_view(), name='registration'),
    url('registration/temporary', TemporaryRegistrationView.as_view(),
        name='temporary-registration'),
    path('activate/<slug:uidb64>/<slug:token>',
         ConfirmUser.as_view(), name='confirm'),
    url('forgotten', ForgottenPassView.as_view(), name='forgotten_pass'),
    path('reset_pass/<slug:uidb64>/<slug:token>',
         PasswordResetConfirmCustomView.as_view(), name='reset_pass'),
    path('<slug:user_id>/student', redirect_to_student, name='redirect-student')
]
