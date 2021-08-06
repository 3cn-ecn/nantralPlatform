from django.db import models
from apps.group.models import Group, NamedMembership
from apps.student.models import Student
from datetime import date


class Family(Group):
    '''Famille de parrainage.'''
    members = models.ManyToManyField(Student, through='MembershipFamily', related_name='family')
    year = models.IntegerField('Année de parrainage')
    
    class Meta:
        verbose_name="Famille"
    
    def save(self, *args, **kwargs):
        # set the year
        if not self.year: self.year = date.today().year
        super(Family, self).save(*args, **kwargs)


class MembershipFamily(NamedMembership):
    """A member of a family"""
    group = models.ForeignKey(Family, on_delete=models.CASCADE, null=True, blank=True)
    student = models.OneToOneField(to=Student, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField("Nom (facultatif)", max_length=100, null=True, blank=True,
        help_text = "Nom de l'étudiant, à renseigner uniquement s'il n'est pas inscrit sur Nantral Platform")
    mentor = models.BooleanField("Parrain/Marraine")
    gender = models.CharField("Genre", max_length=1,
        choices = [('F', 'Féminin'), ('M', 'Masculin'), ('A', 'Autre')])
    foreign_student = models.BooleanField("Êtes-vous un étudiant étranger ?", default=False)
    itii = models.BooleanField("Êtes-vous un étudiant ITII ?", default=False)

    class Meta:
        verbose_name = "Membre"
    
    def __str__(self):
        if self.student:
            return self.student
        elif self.name:
            return self.name
        else:
            return self.id


class QuestionGroup(models.Model):
    name = models.CharField("Nom du groupe de questions", max_length=100)
    name_en = models.CharField("Nom (en)", max_length=100)
    details = models.CharField("Informations supplémentaires", max_length=200, null=True, blank=True)
    details_en = models.CharField("Infos (en)", max_length=200, null=True, blank=True)
    order = models.IntegerField("Ordre", help_text="Ordre d'apparition du groupe dans le questionnaire")

    class Meta:
        verbose_name = "Groupe de Questions"
        verbose_name_plural = "Groupes de Questions"
    
    def __str__(self):
        return self.name


class BaseQuestion(models.Model):
    title = models.CharField("Titre", max_length=100)
    title_en = models.CharField("Titre (en)", max_length=100)
    details = models.CharField("Informations supplémentaires", max_length=200, null=True, blank=True)
    details_en = models.CharField("Informations supplémentaires (en)", max_length=200, null=True, blank=True)
    type_form = models.CharField("Type de Question :", max_length=1, default='1',
        choices = [('1', 'Choisir 1 option'), ('2', 'Choisir Oui/Non'), ('3', 'Choisir J\'aime/J\'aime pas/Ne sais pas')],
        help_text = 'Le champ "valeur" des options est inutile pour les types Oui/Non et J/JP/NSP.')
    
    def __str__(self):
        return self.title


class QuestionMember(BaseQuestion):
    group = models.ForeignKey(QuestionGroup, on_delete=models.CASCADE)
    coeff = models.IntegerField("Coeficient")
    
    class Meta:
        verbose_name = "Question Membres"
        verbose_name_plural = "Questions Membres"


class QuestionFamily(BaseQuestion):
    equivalent = models.ForeignKey(
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
    


class Option(models.Model):
    question = models.ForeignKey(BaseQuestion, on_delete=models.CASCADE)
    value = models.IntegerField('Valeur', null=True, blank=True)
    text = models.CharField('Texte', max_length=50)
    text_en = models.CharField('Texte (en)', max_length=50)



class BaseAnswer(models.Model):
    answer = models.IntegerField()

    class Meta:
        verbose_name = "Réponse"
        abstract=True
    
    def __str__(self):
        return self.question.title

class AnswerMember(BaseAnswer):
    question = models.ForeignKey(QuestionMember, on_delete=models.CASCADE)
    member = models.ForeignKey(MembershipFamily, on_delete=models.CASCADE)

class AnswerFamily(BaseAnswer):
    question = models.ForeignKey(QuestionFamily, on_delete=models.CASCADE)
    family = models.ForeignKey(Family, on_delete=models.CASCADE)