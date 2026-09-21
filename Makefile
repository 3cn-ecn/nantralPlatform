# COMMANDS FOR UNIX
PYTHON := python3
CREATE := touch
COPY := cp
EXPORT = export $(1)=$(2)

# MODIFY COMMANDS FOR WINDOWS
ifeq '$(findstring ;,$(PATH))' ';'
	PYTHON := python
	CREATE := copy NUL
	COPY := copy
	EXPORT = set $(1)=$(2)
endif


# Install the project
.PHONY: install
install:
	cd deployment && \
		$(CREATE) backend.env
	cd backend/config/settings && \
		$(COPY) .env.example .env
	cd backend && \
		mkdir -p "static/front" && \
		uv sync --dev && \
		uv run manage.py migrate && \
		$(call EXPORT,DJANGO_SUPERUSER_PASSWORD,admin) && \
		uv run manage.py createsuperuser --noinput --username np_admin --email admin@ec-nantes.fr && \
		uv run manage.py fakedata
	cd frontend && \
		npm ci
	cd email-templates-generator && \
		npm ci && \
		npm run build
	cd docs && \
		npm ci


# Update after pull
.PHONY: update
update:
	cd frontend && \
		npm i
	cd email-templates-generator && \
		npm i && \
		npm run build
	cd backend && \
		uv sync --dev && \
		uv run manage.py migrate


# Run the tests
.PHONY: test
test:
	cd backend && \
		$(call EXPORT,PIPENV_IGNORE_VIRTUALENVS,1) && \
		uv run ruff check && \
		uv run manage.py test
	cd frontend && \
		npm run test
	cd email-templates-generator && \
		npm run test


# Run the backend and frontend
.PHONY: start
start:
	cd frontend && npm run start &
	cd backend && \
		$(call EXPORT,PIPENV_IGNORE_VIRTUALENVS,1) && \
		uv run manage.py runserver


# Test the quality of code
.PHONY: quality
quality:
	cd backend && uv run ruff check
	cd frontend && npm run types
	cd frontend && npm run lint
