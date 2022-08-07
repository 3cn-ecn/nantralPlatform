# Install the project for windows
win-install:
	python3 -m pip install -U --user pipenv
	cd deployment && \
		copy NUL backend.env
	cd backend/config/settings && \
		copy .env.example .env
	cd backend && \
		python3 -m pipenv sync --dev && \
		python3 -m pipenv run migrate && \
		SET DJANGO_SUPERUSER_PASSWORD=admin && \
		python3 -m pipenv run django createsuperuser --noinput --username admin --email admin@ec-nantes.fr
	cd frontend && \
		npm install && \
		npm run build:dev

# Install the project for unix-systems: linux and macos
unix-install:
	python3 -m pip install -U --user pipenv
	cd deployment && \
		touch backend.env
	cd backend/config/settings && \
		cp .env.example .env
	cd backend && \
		python3 -m pipenv sync --dev && \
		python3 -m pipenv run migrate && \
		export DJANGO_SUPERUSER_PASSWORD=admin && \
		python3 -m pipenv run django createsuperuser --noinput --username admin --email admin@ec-nantes.fr
	cd frontend && \
		npm install && \
		npm run build:dev

# Update after pull
update:
	cd frontend && \
		npm install && \
		npm run build:dev
	cd backend && \
		python3 -m pipenv sync --dev && \
		python3 -m pipenv run migrate

# Run the tests
test:
	cd backend && \
		python3 -m pipenv run test

# Run the backend server
start-backend:
	python -c 'import webbrowser && webbrowser.open("localhost:8000")'
	cd backend && \
		python3 -m pipenv run start

# Run the frontend
start-frontend:
	cd frontend && \
		npm run start

# Test the quality of code
quality:
	flake8 --config setup.cfg ./backend

.PHONY: install-win install-unix test runserver quality
