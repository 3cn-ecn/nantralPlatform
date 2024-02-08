from django.urls import path, re_path

from . import views

app_name = "home"

urlpatterns = [
    # pages
    # shortcuts
    path("me/", views.current_user_page_view, name="me"),
    path("my_coloc/", views.current_user_roommates_view, name="my_coloc"),
    # errors pages
    path("404/", views.handler404),
    path("403/", views.handler403),
    path("500/", views.handler500),
    path("offline.html/", views.offline_view),
    # special files that have to be served from root
    path("sw.js", views.service_worker),
    path(".well-known/assetlinks.json", views.assetlinks),
    # api
    path("doihavetologin/", views.DoIHaveToLoginView.as_view()),
    # use the react router if nothing match
    re_path(r"^(?:(?!api).*/)?$", views.react_app_view, name="home"),
]
