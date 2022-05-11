![Testing](https://github.com/RobinetFox/nantralPlatform/workflows/Testing/badge.svg?branch=master)
![OVH Deploy](https://github.com/RobinetFox/nantralPlatform/workflows/OVH%20Deploy/badge.svg)

# Nantral Platform

1. Project structure
2. Useful Links
3. Contributors

## Project structure
### Description
```
|-.github 
    Contains the definitions for github actions
|-backend
    Contains source files for the backend
|-deployment
    The docker files for deployment
|-frontend
    Contains source files to be compiled for the frontend
|-scripts
    Custom scripts to manage server operations
 ```

### Frontend
The frontend is an npm application using react
source files are compiled using babel and webpack
when files from this folder are compiled they are sent
to static/webapp

### Backend
The backend is a django application.
```
|-apps (Contains all the applications)
|-config (General config folder)
    |-settings
        |-base.py (Base settings)
        |-dev-local.py (Settings for local dev)
        |-production.py (Settings for production)
    |-asgi.py
    |-urls.py (General url config)
    |-wsgi.py
|-templates (Genral template folder)
|-manage.py (General script to launch and make migrations)
|-requirements.txt (Contains python requirements)
```

## Useful Links

### Nantral Platform sites
* [Nantral Platform](https://nantral-platform.fr)
* [Nantral Platform wiki](https://wiki.nantral-platform.fr)

### Django
* [Django - MDN Tutorial](https://developer.mozilla.org/fr/docs/Learn/Server-side/Django)
* [Django Documentation](https://docs.djangoproject.com/en/3.2/)

### Design Documentation
* [Bootstrap for HTML](https://getbootstrap.com/docs/5.0/getting-started/introduction/)
* [Bootstrap for React](https://react-bootstrap.github.io/components/alerts)
* Icons: [Font Awesome](https://fontawesome.com/v5.15/icons?d=gallery&p=2&m=free)


## Contributors
* [Robin TROESCH](https://github.com/unitrium) - founder of Nantral Platform
* [Charles ZABLIT](https://github.com/charles-zablit) - president of Nantral Platform dev club
* [Alexis DELAGE](https://github.com/hydrielax) - random member

    


## Welcome to GitHub Pages

You can use the [editor on GitHub](https://github.com/nantral-platform/nantralPlatform/edit/master/docs/index.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.

### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [Basic writing and formatting syntax](https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/nantral-platform/nantralPlatform/settings/pages). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
