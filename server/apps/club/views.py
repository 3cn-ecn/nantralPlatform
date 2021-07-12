from django.views.generic import ListView
from apps.club.models import Club


class ListClubView(ListView):
    model = Club
    template_name = 'club/list.html'

    def get_context_data(self, **kwargs):
        user = self.request.user
        context = super().get_context_data(**kwargs)
        if user.is_anonymous or not user.is_authenticated or not hasattr(user, 'student'):
            my_clubs = []
        else:
            my_clubs = Club.objects.filter(members__user=self.request.user)
        context['my_clubs'] = [ {
            'grouper': {'name': "Mes Clubs et Assos"},
            'list': my_clubs,
        } ]
        return context

