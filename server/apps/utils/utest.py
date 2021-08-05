from django.contrib.auth import get_user_model

User = get_user_model()

class TestMixin(object):
    def user_setup(self):
        self.u1 = User.objects.create_superuser(
            username='admin', email='admin@ec-nantes.fr', password='pass'
        )
        self.u2 = self.create_user('user2', 'user@ec-nantes.fr')
        self.u3 = self.create_user('user3', 'user3@ec-nantes.fr')
    
    def create_user(self, username, email, is_active=True, name=""):
        u = User.objects.create(username=username, email=email)
        u.set_password('pass')
        u.is_active = is_active
        u.save()
        return u
    
    def user_teardown(self):
        User.objects.all().delete()
