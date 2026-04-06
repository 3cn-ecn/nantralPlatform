# COMMANDS FOR UNIX
PYTHON := python3
CREATE := touch
COPY := cp
PIPENV := pipenv
EXPORT = export $(1)=$(2)

# MODIFY COMMANDS FOR WINDOWS
ifeq '$(findstring ;,$(PATH))' ';'
	PYTHON := python
	CREATE := copy NUL
	COPY := copy
	PIPENV := $(PYTHON) -m pipenv
	EXPORT = set $(1)=$(2)
endif


# Install the project
.PHONY: install
install:
	$(PYTHON) -m pip install --upgrade pipenv --break-system-packages 2>/dev/null || $(PYTHON) -m pip install --upgrade --user pipenv || $(PYTHON) -m pip install --upgrade pipenv
	cd deployment && \
		$(CREATE) backend.env
	cd backend/config/settings && \
		$(COPY) .env.example .env
	cd backend && \
		mkdir -p "static/front" && \
		$(call EXPORT,PIPENV_VENV_IN_PROJECT,1) && \
		$(PIPENV) sync --dev && \
		$(PIPENV) run migrate && \
		$(call EXPORT,DJANGO_SUPERUSER_PASSWORD,admin) && \
		$(PIPENV) run django createsuperuser --noinput --username np_admin --email admin@ec-nantes.fr && \
		$(PIPENV) run fakedata
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
		npm update && \
		npm run build
	cd email-templates-generator && \
		npm update && \
		npm run build
	cd backend && \
		$(call EXPORT,PIPENV_VENV_IN_PROJECT,1) && \
		$(PIPENV) update && \
		$(PIPENV) run migrate


# Check outdated dependencies
.PHONY: outdated
outdated:
	@echo "=== Frontend outdated packages ==="
	@cd frontend && npm outdated || true
	@echo "\n=== Email templates generator outdated packages ==="
	@cd email-templates-generator && npm outdated || true
	@echo "\n=== Backend outdated packages ==="
	@cd backend && $(call EXPORT,PIPENV_VENV_IN_PROJECT,1) && $(PIPENV) check --outdated || true


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
