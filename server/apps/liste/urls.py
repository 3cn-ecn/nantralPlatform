from django.urls import path

from .views import *
#from apps.event.views import UpdateGroupCreateEventView, UpdateGroupArchivedEventsView, UpdateGroupEventsView
#from apps.post.views import UpdateGroupCreatePostView, UpdateGroupPostsView

app_name = 'liste'

urlpatterns = [
    path('', ListListeView.as_view(), name='liste-list'),
]
