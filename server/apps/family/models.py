from django.db import models
from django.urls.base import reverse
from django.core.cache import cache
from django.utils import timezone

from apps.group.models import Group, NamedMembership
from apps.student.models import Student


class Affichage(models.Model):
    phase = models.IntegerField(
        choices = [
            (0, 'Tout masquer'),
            (1, 'Questionnaires Familles & Parrains'),
            (2, 'Questionnaires pour tous'),
            (3, 'Chasse aux parrains'),
            (4, 'Résultats Parrainage'),
        ],
        default=0
    )
    res_itii = models.BooleanField("Afficher les résultats ITII", default=False)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        cache.set('family_phase', self.phase, 3600)
    


class Family(Group):
    '''Famille de parrainage.'''
    members = models.ManyToManyField(Student, through='MembershipFamily')
    year = models.IntegerField('Année de parrainage')
    non_subscribed_members = models.CharField("Autres parrains", max_length=300, null=True, blank=True,
        help_text = "Si certains des membres de la famille ne sont pas inscrits sur Nantral Platform, \
            vous pouvez les ajouter ici. Séparez les noms par des VIRGULES !!!")
    
    class Meta:
        verbose_name="Famille"
        ordering = ['name']
    
    def save(self, *args, **kwargs):
        # set the year
        if not self.year: self.year = timezone.now().year
        super(Family, self).save(*args, **kwargs)
    
    def get_answers_dict(self):
        initial = {}
        for ans in self.answerfamily_set.all():
            initial[f'question-{ans.question.pk}'] = ans.answer
        return initial
    
    def count_members2A(self) -> int:
        nb_subscribed = self.memberships.filter(role='2A+').count()
        if self.non_subscribed_members:
            nb_non_subscribed = len(self.non_subscribed_members.split(','))
        else:
            nb_non_subscribed = 0
        return nb_subscribed + nb_non_subscribed

    # Don't make this a property, Django expects it to be a method.
    # Making it a property can cause a 500 error (see issue #553).   
    def get_absolute_url(self):
        return reverse('family:detail', kwargs={'pk': self.pk})

    @property
    def absolute_url(self):
        return self.get_absolute_url()


class MembershipFamily(NamedMembership):
    """A member of a family"""
    group = models.ForeignKey(to=Family, on_delete=models.CASCADE, null=True, blank=True, related_name='memberships')
    student = models.ForeignKey(to=Student, verbose_name="Parrain/Marraine", on_delete=models.CASCADE, related_name='membershipfamily')
    role = models.CharField("Rôle", max_length=3, choices=[('1A', "1ère Année"), ('2A+', "2ème Année et plus")])

    class Meta:
        verbose_name = "Membre"
        ordering = ['student']
        unique_together = ['group', 'student']
    
    def __str__(self):
        return self.student.__str__()
    
    def get_answers_dict(self, page):
        initial = {}
        for ans in self.answermember_set.filter(question__page=page):
            initial[f'question-{ans.question.pk}'] = ans.answer
        return initial
    
    def form_complete(self):
        nb_done = self.answermember_set.all().count()
        nb_tot = QuestionMember.objects.all().count()
        nb_fam_only = QuestionFamily.objects.filter(quota=100).count()
        return (nb_done >= (nb_tot - nb_fam_only*int(self.role == '2A+')))




class QuestionPage(models.Model):
    name = models.CharField("Nom de la page", max_length=100)
    name_en = models.CharField("Nom (en)", max_length=100)
    details1A = models.TextField("Infos 1A", null=True, blank=True)
    details1A_en = models.TextField("Infos 1A (en)", null=True, blank=True)
    details2A = models.TextField("Infos 2A+", null=True, blank=True)
    details2A_en = models.TextField("Infos 2A+ (en)", null=True, blank=True)
    order = models.IntegerField("Ordre", unique=True, 
        help_text="Ordre d'apparition de la page dans le questionnaire")

    class Meta:
        verbose_name = "Page de Questions"
        verbose_name_plural = "Pages de Questions"
        ordering=['order']
    
    def __str__(self):
        return self.name



class BaseQuestion(models.Model):
    code_name = models.CharField("Nom de code", max_length=50)
    label = models.CharField("Question", max_length=100)
    label_en = models.CharField("Question (en)", max_length=100)
    details = models.CharField("Informations supplémentaires", max_length=200, null=True, blank=True)
    details_en = models.CharField("Informations supplémentaires (en)", max_length=200, null=True, blank=True)
    order = models.IntegerField("Ordre", help_text="Ordre d'apparition de la question", default=0)

    def __str__(self):
        return self.code_name
    
    def save(self, *args, **kwargs):
        if not self.code_name:
            self.code_name = self.label
        if not self.label_en:
            self.label_en = self.label
        super().save(*args, **kwargs)



class GroupQuestion(BaseQuestion):
    page = models.ForeignKey(QuestionPage, on_delete=models.CASCADE)
    coeff = models.IntegerField("Coeficient")
    
    class Meta:
        verbose_name = "Groupe de Questions"
        verbose_name_plural = "Groupes de Questions"


class Option(models.Model):
    question = models.ForeignKey(BaseQuestion, on_delete=models.CASCADE)
    value = models.IntegerField('Valeur')
    text = models.CharField('Texte', max_length=50)
    text_en = models.CharField('Texte (en)', max_length=50)

    class Meta:
        ordering = ['question', 'value']
        unique_together = ['question', 'value']



class QuestionMember(BaseQuestion):
    page = models.ForeignKey(QuestionPage, on_delete=models.CASCADE)
    coeff = models.IntegerField("Coeficient")
    group = models.ForeignKey(GroupQuestion, verbose_name="Groupe",
        help_text = "Renseignez si cette question fait partie d'un \
            groupe de questions similaires. Tous les champs sont alors \
            remplis automatiquement, sauf le nom de la question.",
        null=True, blank=True, on_delete=models.SET_NULL)
    
    class Meta:
        verbose_name = "Question Membres"
        verbose_name_plural = "Questions Membres"
        ordering=['page', 'order']
    
    def save(self, *args, **kwargs):
        if self.group:
            self.page = self.group.page
            self.coeff = self.group.coeff
            self.order = self.group.order
            super(QuestionMember, self).save(*args, **kwargs)
            for o in Option.objects.filter(question=self):
                o.delete()
            for o in self.group.option_set.all():
                self.option_set.create(
                    value = o.value,
                    text = o.text,
                    text_en = o.text_en,
                )
        else:
            super(QuestionMember, self).save(*args, **kwargs)



class QuestionFamily(BaseQuestion):
    equivalent = models.OneToOneField(to=QuestionMember, related_name='equivalent',
        verbose_name="Question équivalente", on_delete=models.CASCADE, null=True, blank=True,
        help_text="Question équivalente dans le questionnaire des membres. Laissez vide si vous \
                    souhaitez que cette question ne soit pas prise en compte dans l'algo.")
    quota = models.IntegerField("Quota", 
        help_text = "Pourcentage de prise en compte de cette question dans le \
        calcul des réponses du parrain. 100 supprime la question du questionnaire \
        parrain (mais pas du questionnaire filleul)."
    )

    class Meta:
        verbose_name = "Question Familles"
        verbose_name_plural = "Questions Familles"
        ordering=['order']
    




class BaseAnswer(models.Model):
    answer = models.IntegerField()

    class Meta:
        abstract=True
    
    def __str__(self):
        return self.question.code_name

class AnswerMember(BaseAnswer):
    question = models.ForeignKey(QuestionMember, on_delete=models.CASCADE)
    member = models.ForeignKey(MembershipFamily, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Réponse"
        unique_together = ['question', 'member']


class AnswerFamily(BaseAnswer):
    question = models.ForeignKey(QuestionFamily, on_delete=models.CASCADE)
    family = models.ForeignKey(Family, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Réponse"
        unique_together = ['question', 'family']