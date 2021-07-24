"""nantralPlatform URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
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
from django.contrib import admin
from django.urls import path, include
# pour importer les fichiers en dev local
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    path('account/', include('apps.account.urls', namespace='account')),

    path('student/', include('apps.student.urls', namespace='student')),
    path('api/student/', include('apps.student.api_urls', namespace='student_api')),

    #path('group/', include('apps.group.urls',  namespace='group')),
    path('club/', include('apps.club.urls',  namespace='club')),
    path('liste/', include('apps.liste.urls',  namespace='liste')),

    path('academic/', include('apps.academic.urls', namespace='academic')),
    path('api/academic/', include('apps.academic.api_urls', namespace='academic_api')),

    path('services/', include('apps.services.urls', namespace='services')),

    path('event/', include('apps.event.urls', namespace='event')),
    path('api/event/', include('apps.event.api_urls', namespace='event_api')),
    path('post/', include('apps.post.urls', namespace='post')),
    path('api/post/', include('apps.post.api_urls', namespace='post_api')),
    path('booking/', include('apps.booking.urls', namespace='booking')),
    path('exchange/', include('apps.exchange.urls', namespace='exchange')),

    path('colocs/', include('apps.roommates.urls', namespace='roommates')),
    path('api/colocs/', include('apps.roommates.api_urls', namespace='roommates_api')),

    path('', include('apps.home.urls', namespace='home')),
]

handler404 = 'apps.home.views.handler404'
handler500 = 'apps.home.views.handler500'

urlpatterns += [
    path("ckeditor5/", include('django_ckeditor_5.urls'))
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
