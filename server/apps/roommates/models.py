from django.db import models
from apps.group.models import Group
from django.utils.text import slugify

class Housing(models.Model):
	adress = models.CharField(max_length=250)
	latitude = models.FloatField()
	longitude = models.FloatField()

class Roommates(Group):
	begin_date = models.DateField()
	end_date = models.DateField()
	housing = models.ForeignKey(to=Housing, on_delete=models.CASCADE)

	class Meta:
		verbose_name_plural = "Roommates"

	def save(self, *args, **kwargs):
		self.slug = f'coloc--{slugify(self.name)}'
		super(Roommates, self).save(*args, **kwargs)

