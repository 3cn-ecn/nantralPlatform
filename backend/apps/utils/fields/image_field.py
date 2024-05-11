import os
from datetime import datetime

from django.db import models
from django.utils.text import slugify

from ..compress import compress_image


class CustomImageFieldFile(models.ImageField.attr_class):
    def save(self, name, content, save=True):
        """Compress the image before saving it."""
        try:
            old_instance = self.field.model.objects.get(pk=self.instance.pk)
            old_file = getattr(old_instance, self.field.attname)
        except self.field.model.DoesNotExist:
            old_file = None

        if content != old_file:
            new_content = compress_image(
                content,
                self.field.size,
                self.field.crop,
            )

        super().save(name, new_content, save)


class CustomImageField(models.ImageField):
    """A custom ImageField.

    ImageField that deletes the previous image file when a new file is uploaded,
    and compresses the uploaded image.

    Remember to add <your_field_name>.delete(save=False) in the
    delete() method of your model.
    """

    attr_class = CustomImageFieldFile

    def __init__(
        self,
        *args,
        size: tuple[int, int] = (500, 500),
        crop: bool = False,
        name_from_field="pk",
        **kwargs,
    ):
        self.size = size
        self.crop = crop
        self.name_from_field = name_from_field
        kwargs["upload_to"] = self.create_filename
        super().__init__(*args, **kwargs)

    @property
    def non_db_attrs(self):
        return (*super().non_db_attrs, "size", "crop", "name_from_field")

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        del kwargs["upload_to"]
        return name, path, args, kwargs

    def create_filename(self, instance, filename):
        app_label = instance._meta.app_label
        model_name = instance._meta.model_name
        field_name = self.name

        extension = filename.split(".")[-1]
        field_for_name = self.name_from_field

        filename_slug = slugify(str(getattr(instance, field_for_name)))[:20]

        date = datetime.now().strftime("%Y-%m-%d")
        year = datetime.now().strftime("%Y")
        timestamp = str(int(datetime.timestamp(datetime.now())))

        return os.path.join(
            f"{app_label}/{model_name}/{field_name}/{year}/",
            f"{date}-{filename_slug}-{timestamp}.{extension}",
        )

    def pre_save(self, model_instance, add):
        """Delete the old image file if a new one is uploaded."""
        try:
            old_instance = self.model.objects.get(pk=model_instance.pk)
            old_image = getattr(old_instance, self.attname)
        except self.model.DoesNotExist:
            old_image = None

        new_file = super().pre_save(model_instance, add)

        if old_image and old_image != new_file:
            old_image.delete(save=False)

        setattr(model_instance, self.attname, new_file)

        return new_file
