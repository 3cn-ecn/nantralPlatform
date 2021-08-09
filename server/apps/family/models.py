from django.db import models
from django.urls.base import reverse
from datetime import date

from apps.group.models import Group, NamedMembership
from apps.student.models import Student


class Affichage(models.Model):
    phase = models.IntegerField(
        choices = [
            (0, 'Tout masquer'),
            (1, 'Questionnaires Parrainage'),
            (2, 'Chasse aux parrains'),
            (3, 'Résultats Parrainage'),
        ],
        default=0
    )
    res_itii = models.BooleanField("Afficher les résultats ITII", default=False)


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
        if not self.year: self.year = date.today().year
        super(Family, self).save(*args, **kwargs)
    
    def get_answers_dict(self):
        initial = {}
        for ans in self.answerfamily_set.all():
            initial[f'question-{ans.question.pk}'] = ans.answer
        return initial
    
    @property
    def get_absolute_url(self):
        return reverse('family:detail', kwargs={'pk': self.pk})


class MembershipFamily(NamedMembership):
    """A member of a family"""
    group = models.ForeignKey(to=Family, on_delete=models.CASCADE, related_name='memberships')
    student = models.ForeignKey(to=Student, verbose_name="Parrain/Marraine", on_delete=models.CASCADE, related_name='membershipfamily')
    role = models.CharField("Rôle", max_length=3, choices=[('1A', "1ère Année"), ('2A+', "2ème Année et plus")])
    gender = models.CharField("Genre", max_length=1, null=True,
        choices = [('F', 'Féminin'), ('M', 'Masculin'), ('A', 'Autre')])
    foreign_student = models.BooleanField("Êtes-vous un étudiant étranger ?", default=False)
    itii = models.BooleanField("Êtes-vous un étudiant ITII ?", default=False)
    remixage = models.BooleanField("Membre remixé", default=False)

    class Meta:
        verbose_name = "Membre"
        ordering = ['student']
    
    def __str__(self):
        if self.student:
            return self.student
        elif self.name:
            return self.name
        else:
            return self.id


class QuestionPage(models.Model):
    name = models.CharField("Nom de la page", max_length=100)
    name_en = models.CharField("Nom (en)", max_length=100)
    details = models.CharField("Informations supplémentaires", max_length=200, null=True, blank=True)
    details_en = models.CharField("Infos (en)", max_length=200, null=True, blank=True)
    order = models.IntegerField("Ordre", help_text="Ordre d'apparition de la page dans le questionnaire")

    class Meta:
        verbose_name = "Page de Questions"
        verbose_name_plural = "Pages de Questions"
    
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
    equivalent = models.OneToOneField(
        to=QuestionMember, verbose_name="Question équivalente", on_delete=models.CASCADE,
        help_text="Question équivalente dans le questionnaire des membres")
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
        verbose_name = "Réponse"
        abstract=True
    
    def __str__(self):
        return self.question.code_name

class AnswerMember(BaseAnswer):
    question = models.ForeignKey(QuestionMember, on_delete=models.CASCADE)
    member = models.ForeignKey(MembershipFamily, on_delete=models.CASCADE)

class AnswerFamily(BaseAnswer):
    question = models.ForeignKey(QuestionFamily, on_delete=models.CASCADE)
    family = models.ForeignKey(Family, on_delete=models.CASCADE)