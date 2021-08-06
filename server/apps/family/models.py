from django.db import models
from apps.group.models import Group, NamedMembership
from apps.student.models import Student
from datetime import date


class Family(Group):
    '''Famille de parrainage.'''
    members = models.ManyToManyField(Student, through='MembershipFamily')
    answers = models.ManyToManyField(to='Answer')
    year = models.IntegerField('Année de parrainage')
    
    class Meta:
        verbose_name="Famille"
    
    def save(self, *args, **kwargs):
        # set the year
        if not self.year: self.year = date.today().year
        super(Family, self).save(*args, **kwargs)


class MembershipFamily(NamedMembership):
    """A member of a family"""
    group = models.ForeignKey(Family, on_delete=models.CASCADE)
    student = models.OneToOneField(to=Student, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField("Nom de l'étudiant", max_length=100, null=True, blank=True)
    mentor = models.BooleanField("Parrain/Marraine")
    answers = models.ManyToManyField(to='Answer')

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

    class Meta:
        verbose_name = "Groupe de Questions"
        verbose_name_plural = "Groupes de Questions"
    
    def __str__(self):
        return self.name


class Question(models.Model):
    group = models.ForeignKey(QuestionGroup, on_delete=models.CASCADE)
    title = models.CharField("Titre", max_length=100)
    title_en = models.CharField("Titre", max_length=100)
    details = models.CharField("Informations supplémentaires", max_length=200, null=True, blank=True)
    details_en = models.CharField("Informations supplémentaires", max_length=200, null=True, blank=True)
    coeff = models.IntegerField("Coeficient")
    options = [
        {'value': models.IntegerField(f'Valeur Option {x}', null=True, blank=True),
         'text': models.CharField(f'Option {x}', max_length=50, null=True, blank=True),
         'text_en': models.CharField(f'Option {x} (en)', max_length=50, null=True, blank=True)}
        for x in range(10)]
    
    def __str__(self):
        return self.title


class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    value = models.IntegerField('Valeur'),
    text = models.CharField('Texte', max_length=50),
    text_en = models.CharField('Texte (en)', max_length=50)



class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.IntegerField()

    class Meta:
        verbose_name = "Réponse"
    
    def __str__(self):
        return self.question.title
