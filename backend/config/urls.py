"""NantralPlatform URL Configuration.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/

Examples
--------
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

import debug_toolbar
from django.contrib import admin
from django.urls import path, include

# pour importer les fichiers en dev local
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # default and third-party apps
    path('admin/', admin.site.urls),
    path('__debug__/', include(debug_toolbar.urls)),
    path("ckeditor5/", include('django_ckeditor_5.urls')),

    # apps
    path('account/', include('apps.account.urls', namespace='account')),
    path('student/', include('apps.student.urls', namespace='student')),
    path('club/', include('apps.club.urls',  namespace='club')),
    path('liste/', include('apps.liste.urls',  namespace='liste')),
    path('colocs/', include('apps.roommates.urls', namespace='roommates')),
    path('administration/', include(
        'apps.administration.urls',  namespace='administration')),
    path('academic/', include('apps.academic.urls', namespace='academic')),
    path('parrainage/', include('apps.family.urls', namespace='family')),
    path('parrainage/admin/', include(
        'apps.family.admin_urls', namespace='family-admin')),
    path('post/', include('apps.post.urls', namespace='post')),
    path('event/', include('apps.event.urls', namespace='event')),
    path('services/', include('apps.services.urls', namespace='services')),
    path('notification/', include(
        'apps.notification.urls', namespace='notification')),
    # path('exchange/', include('apps.exchange.urls', namespace='exchange')),

    # api
    path('api/student/', include(
        'apps.student.api_urls', namespace='student_api')),
    path('api/club/',  include('apps.club.api_urls', namespace='club_api')),
    path('api/liste/', include('apps.liste.api_urls',  namespace='liste_api')),
    path('api/colocs/', include(
        'apps.roommates.api_urls', namespace='roommates_api')),
    path('api/administration/', include(
        'apps.administration.api_urls',  namespace='administration_api')),
    path('api/academic/', include(
        'apps.academic.api_urls', namespace='academic_api')),
    path('api/post/', include('apps.post.api_urls', namespace='post_api')),
    path('api/event/', include('apps.event.api_urls', namespace='event_api')),
    path('api/notification/', include(
        'apps.notification.api_urls', namespace='notification_api')),

    # homepage
    path('', include('apps.home.urls', namespace='home'))
]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)

handler403 = 'apps.home.views.handler403'
handler404 = 'apps.home.views.handler404'
handler413 = 'apps.home.views.handler413'
handler500 = 'apps.home.views.handler500'