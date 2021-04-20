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
from django.conf.urls import url, include
from django.urls import path

urlpatterns = [
    url('admin/', admin.site.urls),
    url('account/', include('apps.account.urls', namespace='account')),
    url('student/', include('apps.student.urls', namespace='student')),
    url('api/student/', include('apps.student.api_urls', namespace='student_api')),
    url('group/', include('apps.group.urls',  namespace='group')),
    url('academic/', include('apps.academic.urls', namespace='academic')),
    url('api/academic/', include('apps.academic.api_urls', namespace='academic_api')),
    url('services/', include('apps.services.urls', namespace='services')),
    url('event/', include('apps.event.urls', namespace='event')),
    url('api/event/', include('apps.event.api_urls', namespace='event_api')),
    url('post/', include('apps.post.urls', namespace='post')),
    url('api/post/', include('apps.post.api_urls', namespace='post_api')),
    url('exchange/', include('apps.exchange.urls', namespace='exchange')),
    url('api/roommates/', include(('apps.roommates.api_urls'), namespace='roommates_api')),
    url('', include('apps.home.urls', namespace='home')),
]

handler404 = 'apps.home.views.handler404'
handler500 = 'apps.home.views.handler500'
