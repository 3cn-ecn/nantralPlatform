![Testing](https://github.com/RobinetFox/nantralPlatform/workflows/Testing/badge.svg?branch=master)
![EC2 Deploy](https://github.com/RobinetFox/nantralPlatform/workflows/EC2%20Deploy/badge.svg)
# Nantral Platform

1. Project structure
2. Local dev
3. Guidelines

## Project structure
### Description
```
|-.github 
    Contains the definitions for github actions
|-frontend
    Contains source files to be compiled for the frontend
|-server
    Contains source files for the backend
|-static
    Contains static files to be served by the server
 ```

### Frontend
The frontend is an npm application using react
source files are compiled using babel and webpack
when files from this folder are compiled they are sent
to static/webapp

### Server
The server is a django application.
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
## Local dev

### Let's get you started:
#### Install
- First install python 3.6 +
- Install virtualenv for python with `pip3 install virtualenv`

#### Server
- Go into the server folder
- Create a virtualenv with `python3 -m virtualenv env` or `python -m virtualenv env` if it doesn't work
- Activate your venv with `source env/bin/activate` or `env\Scripts\activate.bat` on Windows
- Install the python dependencies with `pip install -r requirements.txt`
- In the config/settings folder, create a .env file and fill it out with the sample, located at `server/config/settings/sample_env.txt`
- Launch the server with `python manage.py runserver`
- The server runs on localhost:8000
You are ready to go.
### Create a superuser with:
`python manage.py createsuperuser`

### To test use pytest :
- ```pytest```

### Regular start:
- In deployement_templates/local launch DB with `docker-compose up -d`
- In the server folder activate your venv with `source env/bin/activate`
- Launch the server with `python manage.py runserver`

### Migrations:
Whenever you make a change on a model you need to migrate those modifications
to your database.
To do so use `python manage.py makemigrations` in the server folder
When you are ready to apply those migrations use `python manage.py migrate`
Try to rename the migrations scripts to something more understandable for a human.
Example : rename migration01.py to create_news_model_alter_clubs.py
Try to merge migrations into one migration as much as possible

### Frontend Dev:
To dev on the frontend webapp first start the django server.
Then go to the frontend folder.
On first time install all the required packages. Do this with `npm install`
use `npm start -- --watch` to recompile the frontend each time you modify something
This way you will see your webapp evolve in your browser
 
### Create a new server app

To create a new app in the django server :
`python manage.py createapp app_name`
this will create a new folder with the app name you chose.
Move the folder to the apps folder.
Create a urls.py script inside the folder. Base this script on other urls.py you can find in other apps.
In config/urls.py add a namespace for your app like this :
`url('app_name/', include('apps.app_name.urls', namespace='app_name')),`
this will link the url router to your urls.py in the app folder you created.
Finally add the app in config/settings/base.py:
`COMMON_APPS = [
    'apps.app_name',
 ]
`
Remember to do migrations if you add a model!
### Closing things:
Close your virtualenv with `deactivate` anywhere

### Backups

Backups of the database are made every day at 11:00 PM
They are stored for 30 days.
To make a backup manually 
docker-compose exec dbbackup ./backups

A simple restore script is provided. You need to specify some environment variables first:

    TARGET_DB: the db name to restore
    TARGET_ARCHIVE: the full path of the archive to restore

The restore script will delete the TARGET_DB, so make sure you know what you are doing. Then it will create a new one and restore the content from TARGET_ARCHIVE

If you specify these environment variable using docker-compose.yml file, then you can execute a restore process like this:

docker-compose exec dbbackup ./restore.sh


## Guidelines

Please keep applications as small as possible.
Each application should have one unique purpose.
This keeps things as clean and nice as possible.
Exemple the club application should only be used to
manage clubs. The news application while beeing used
by clubs should not be a function of clubs but a standalone
app.  This ensures atomicity and easy unittesting.

Please use some linter to keep your code clean.

When developping in local do use a virtualenv. See local dev.

Write a unittest at least for every view that you write. Think also of edgecases.
Remember to also test the wrong behavior. For exemple test that none except 
club manager can publish on a club's page not just that the publish function works.

Write clear commit messages about what you changed ex :
+ add Club model
+ reworked News model

One feature or bug fix per branch always base a branch on master.
Never base a branch on another branch.


Contributors :
    


