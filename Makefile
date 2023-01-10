# COMMANDS FOR UNIX
CREATE := touch
PYTHON := python3
COPY := cp
EXPORT := export
PIPENV := $(PYTHON) -m pipenv

# MODIFY COMMANDS FOR WINDOWS
ifeq '$(findstring ;,$(PATH))' ';'
	CREATE := copy NUL
	PYTHON := python
	COPY := copy
	EXPORT := set
	PIPENV := $(PYTHON) -m pipenv
endif


# Install the project
install:
	$(PYTHON) -m pip install --upgrade --user pipenv
	cd deployment && \
		$(CREATE) backend.env
	cd backend/config/settings && \
		$(COPY) .env.example .env
	cd backend && \
		$(EXPORT) PIPENV_VENV_IN_PROJECT=1 && \
		$(PIPENV) sync --dev && \
		$(PIPENV) run migrate && \
		$(EXPORT) DJANGO_SUPERUSER_PASSWORD=admin && \
		$(PIPENV) run django createsuperuser --noinput --username admin --email admin@ec-nantes.fr
	cd frontend && \
		npm install && \
		npm run build:dev


# Update after pull
update:
	$(PYTHON) -m pip install --upgrade --user pipenv
	cd frontend && \
		npm install && \
		npm run leg:build:dev
	cd backend && \
		$(PIPENV) sync --dev && \
		$(PIPENV) run migrate


# Run the tests
test:
	cd backend && \
		$(PIPENV) run test


# Run the backend server
start-backend:
	python -c 'import webbrowser && webbrowser.open("localhost:8000")'
	cd backend && \
		$(PIPENV) run start


# Run the frontend
start-frontend:
	cd frontend && \
		npm run start


# Test the quality of code
quality:
	flake8 --config setup.cfg ./backend


.PHONY: install update test quality
