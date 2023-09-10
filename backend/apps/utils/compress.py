# spell-checker: words LANCZOS getsizeof pyaccess

import sys
from io import BytesIO

from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models import Model

from PIL import Image


def compress_model_image(
    obj: Model, field: str, size: tuple[int, int] = (500, 500), crop=False
):
    image = getattr(obj, field)
    if not obj.pk or image != getattr(type(obj).objects.get(pk=obj.pk), field):
        image = compress_image(image, size, crop)
    return image


def compress_image(image, size=(500, 500), crop=False):
    """Compress an image."""
    if not image:
        return image
    file_format = find_format(image)
    if file_format == "GIF":
        return image
    im = Image.open(image)

    # Calculate aspect ratio
    aspect_ratio = im.width / im.height
    target_aspect_ratio = size[0] / size[1]

    if aspect_ratio > target_aspect_ratio:
        new_height = size[1]
        new_width = int(size[1] * aspect_ratio)
    else:
        new_width = size[0]
        new_height = int(size[0] / aspect_ratio)

    # Resize the image
    if new_width < im.width or new_height < im.height:
        im = im.resize((new_width, new_height), Image.LANCZOS)

    # If crop is True, crop the image to the target size
    if crop:
        left = (new_width - size[0]) / 2
        top = (new_height - size[1]) / 2
        right = (new_width + size[0]) / 2
        bottom = (new_height + size[1]) / 2
        im = im.crop((left, top, right, bottom))

    im_io = BytesIO()
    im.save(im_io, format=file_format, quality=80, optimize=True)
    new_image = InMemoryUploadedFile(
        im_io,
        "ImageField",
        image.name,
        "image/" + file_format,
        sys.getsizeof(im_io),
        None,
    )
    im.close()
    return new_image


def find_format(image):
    """Find the file format."""
    ext = "." + image.name.split(".")[-1].lower()
    if ext not in Image.EXTENSION:
        Image.init()
    try:
        file_format = Image.EXTENSION[ext]
    except KeyError:
        raise ValueError(f"Unknown file extension: {ext}")
    return file_format
