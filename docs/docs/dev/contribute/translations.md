# Translations

## Install `gettext`

Firstly, you have to install the `gettext` program.
On linux, just run:
```bash
sudo apt-get install gettext
```
For MacOs:
```bash
brew install gettext
```
For Windows, follow [this tutorial](https://www.drupal.org/docs/8/modules/potion/how-to-install-setup-gettext#s-).

## Use the `gettext` method

In your code, use the `gettext` method to signal to django that the text should
be translated:

```python
from django.utils.translation import gettext as _

def get_welcome_text(request):
    return _("Bienvenue sur Nantral Platform !")
```

For texts that are NOT inside a function or a method, you have to call 
`gettext_lazy` instead of `gettext` so that the translation is not evluated 
only once on the website start up.

```python
from django.utils.translation import gettext_lazy as _

class Group(models.Model):
    name = models.CharField(_("Nom du groupe"))
```

## Write the Translations

First, create the `.po` file:
* Go into the app where you want to add translations:
    ```bash
    cd apps/<app_name>
    ```
* Create the `.po` files for the English translations:
    ```bash
    pipenv run django-admin makmessages -l en
    ```
* Open the `.po` file created in `locale/en/LC_MESSAGES`,
    and fill in all the translations.

## Compile the translations

Once you have finished, it's time to compile the translations! Just run, in
the `backend` directory:
```bash
pipenv run django compilemessages
```

That's it! You can now run the website, and see your translations by adding
`/en` at the beginning of the url.
