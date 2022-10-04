from django.urls import path, re_path

from . import views

app_name = 'home'

urlpatterns = [
    path('suggestions/', views.SuggestionView.as_view(), name='suggestions'),
    path('legal_mentions/', views.LegalMentionsView.as_view(), name='mentions'),
    path('me/', views.current_user_page_view, name='me'),
    path('my_coloc/', views.current_user_roommates_view, name='my_coloc'),
    path('home/', views.HomeView.as_view(), name='home'),
    path('404/', views.handler404),
    path('403/', views.handler403),
    path('413/', views.handler413),
    path('500/', views.handler500),
    path('sw.js', views.service_worker),
    path('offline.html/', views.offline_view),
    path('doihavetologin/', views.DoIHaveToLoginView.as_view()),
    # use the react router if nothing match
    path('', views.react_app_view),
    re_path(r'^.*/$', views.react_app_view),
]
