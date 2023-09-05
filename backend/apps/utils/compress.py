# spell-checker: words LANCZOS getsizeof pyaccess

import sys
from io import BytesIO

from django.core.files.uploadedfile import InMemoryUploadedFile

from PIL import Image


def compress_model_image(object, field, size=(500, 500), contains=False):
    image_field = getattr(object, field)
    if not object.pk or image_field != getattr(
        type(object).objects.get(pk=object.pk), field
    ):
        image_field = compress_image(image_field, size, contains)
    return image_field


def compress_image(image, size=(500, 500), contains=False):
    """Compresse une image"""
    # exception null
    if not image:
        return image
    # find the format
    format = find_format(image)
    # pas de compression pour les gif, pour conserver l'animation
    if format == "GIF":
        return image
    # open the image
    im = Image.open(image)
    # resize
    if contains:
        # don't crop the image, the new size is more little than the given size
        im.thumbnail(size, resample=Image.LANCZOS)
    else:
        # crop the new image, the new size is exactly the given size
        im = crop_ratio(im, ratio=size[0] / size[1])
        thumbnail_cover(im, size, resample=Image.LANCZOS)
    # create a BytesIO object
    im_io = BytesIO()
    # save image to BytesIO object
    im.save(im_io, format=format, quality=90, optimize=True)
    # create a django-friendly Files object
    new_image = InMemoryUploadedFile(
        im_io,
        "ImageField",
        image.name,
        "image/" + format,
        sys.getsizeof(im_io),
        None,
    )
    im.close()
    return new_image


def find_format(image):
    """Trouver le format du fichier"""
    ext = "." + image.name.split(".")[-1].lower()
    if ext not in Image.EXTENSION:
        Image.init()
    try:
        format = Image.EXTENSION[ext]
    except KeyError:
        raise ValueError("unknown file extension: {}".format(ext))
    return format


def crop_ratio(image, ratio):
    x, y = image.size
    if x / y > ratio:
        new_x = y * ratio
        box = (int((x - new_x) / 2), 0, int((x + new_x) / 2), y)
    else:
        new_y = x / ratio
        box = (0, int((y - new_y) / 2), x, int((y + new_y) / 2))
    new_image = image.crop(box)
    return new_image


def thumbnail_cover(image, size, resample=Image.Resampling.BICUBIC):
    """
    Make the image as a thumbnail, but crop the image to match
    the given size instead of reducing it.
    """

    # preserve aspect ratio
    x, y = image.size
    if x / y > size[0] / size[1]:
        x = int(max(size[1] * x / y, 1))
        y = int(size[1])
    else:
        y = int(max(size[0] * y / x, 1))
        x = int(size[0])
    size = x, y

    if size[0] > image.size[0] or size[1] > image.size[1]:
        return

    image.draft(None, size)

    im = image.resize(size, resample)

    image.im = im.im
    image.mode = im.mode
    image._size = size

    image.readonly = 0
    image.pyaccess = None
