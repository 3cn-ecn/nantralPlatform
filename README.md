[![Deploy Server](https://github.com/nantral-platform/nantralPlatform/actions/workflows/deploy-server.yml/badge.svg?branch=master)](https://nantral-platform.fr)
[![Deploy Staging](https://github.com/nantral-platform/nantralPlatform/actions/workflows/deploy-staging.yml/badge.svg?branch=staging)](https://dev.nantral-platform.fr)
[![Deploy Docs](https://github.com/nantral-platform/nantralPlatform/actions/workflows/deploy-docs.yml/badge.svg?branch=master)](https://docs.nantral-platform.fr)

![Test Django](https://github.com/nantral-platform/nantralPlatform/actions/workflows/test-django.yml/badge.svg)
![Test Docs](https://github.com/nantral-platform/nantralPlatform/actions/workflows/test-docs.yml/badge.svg)

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

    
