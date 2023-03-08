# COMMANDS FOR UNIX
CREATE := touch
PYTHON := python3
COPY := cp
PIPENV := $(PYTHON) -m pipenv
EXPORT = export $(1)=$(2)

# MODIFY COMMANDS FOR WINDOWS
ifeq '$(findstring ;,$(PATH))' ';'
	CREATE := copy NUL
	PYTHON := python
	COPY := copy
	PIPENV := $(PYTHON) -m pipenv
	EXPORT = set $(1) $(2)
endif


# Install the project
.PHONY: install
install:
	$(PYTHON) -m pip install --upgrade --user pipenv
	cd deployment && \
		$(CREATE) backend.env
	cd backend/config/settings && \
		$(COPY) .env.example .env
	cd backend && \
		$(call EXPORT,PIPENV_VENV_IN_PROJECT,1) && \
		$(PIPENV) sync --dev && \
		$(PIPENV) run migrate && \
		$(call EXPORT,DJANGO_SUPERUSER_PASSWORD,admin) && \
		$(PIPENV) run django createsuperuser --noinput --username admin --email admin@ec-nantes.fr
	cd frontend && \
		npm ci && \
		npm run build:dev


# Update after pull
.PHONY: update
update:
	$(PYTHON) -m pip install --upgrade --user pipenv
	cd frontend && \
		npm install && \
		npm run leg:build:dev
	cd backend && \
		$(PIPENV) sync --dev && \
		$(PIPENV) run migrate


# Run the tests
.PHONY: test
test:
	cd backend && \
		$(PIPENV) run test


# Run the backend server
.PHONY: backend-start
backend-start:
	cd backend && $(PIPENV) run start


# Run the frontend
.PHONY: frontend-start
frontend-start:
	$(PYTHON) -c 'import webbrowser, time; time.sleep(3); webbrowser.open("localhost:8000")' &
	cd frontend && npm run start


# Test the quality of code
.PHONY: quality
quality:
	flake8 --config setup.cfg ./backend
