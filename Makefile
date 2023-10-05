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
	EXPORT = set $(1)=$(2)
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
		mkdir "static/front" && \
		$(call EXPORT,PIPENV_VENV_IN_PROJECT,1) && \
		$(PIPENV) sync --dev && \
		$(PIPENV) run migrate && \
		$(call EXPORT,DJANGO_SUPERUSER_PASSWORD,admin) && \
		$(PIPENV) run django createsuperuser --noinput --username admin --email admin@ec-nantes.fr
	cd frontend && \
		npm ci
	cd email-templates-generator && \
		npm ci && \
		npm run build


# Update after pull
.PHONY: update
update:
	cd frontend && \
		npm i
	cd email-templates-generator && \
		npm i && \
		npm run build
	cd backend && \
		$(PIPENV) sync --dev && \
		$(PIPENV) run migrate


# Run the tests
.PHONY: test
test:
	cd backend && \
		$(PIPENV) run lint && \
		$(PIPENV) run test
	cd frontend && \
		npm run test
	cd email-templates-generator && \
		npm run test


# Run the backend and frontend
.PHONY: start
start:
	cd frontend && npm run start &
	cd backend && $(PIPENV) run start


# Test the quality of code
.PHONY: quality
quality:
	flake8 --config setup.cfg ./backend
	cd frontend && npm run types
	cd frontend && npm run lint
