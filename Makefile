# Python part of the project
unix-env:
	cd backend && \
		./install.sh

windows-env:
	python3 -m pip install virtualenv
	cd backend && python3 -m virtualenv env
	backend\env\Scripts\activate.bat
	cd backend && python3 -m pip install -r requirements.txt
	python3 backend/manage.py migrate

# Run the tests
run-tests:
	cd backend && \
		python manage.py test

# Init and run the backend
init-backend:
	cd backend && \
		python manage.py createsuperuser

run-backend:
	python -c 'import webbrowser; webbrowser.open("localhost:8000")'
	cd backend && \
		python manage.py runserver

quality:
	flake8 --config backend/flake8.cfg ./backend

.PHONY: unix-env windows-env run-tests init-backend run-runbackend quality


# Front-end part of the project
front-compile:
	cd frontend && \
		npm install
	cd frontend && \
		npm run dev
