# Python part of the project
unix-env:
	cd server && \
		./install.sh

windows-env:
	python3 -m pip install virtualenv
	cd server && python3 -m virtualenv env
	server\env\Scripts\activate.bat
	cd server && python3 -m pip install -r requirements.txt
	python3 server/manage.py migrate

# Run the tests
run-tests:
	cd server && \
		python manage.py test

# Init and run the server
init-server:
	cd server && \
		python manage.py createsuperuser

run-server:
	python -c 'import webbrowser; webbrowser.open("localhost:8000")'
	cd server && \
		python manage.py runserver

quality:
	flake8 --config server/flake8.cfg ./server

.PHONY: unix-env windows-env run-tests init-server run-runserver quality


# Front-end part of the project
front-compile:
	cd frontend && \
		npm install
	cd frontend && \
		npm run dev
