# Install the project for windows
install-win:
	python3 -m pip install -U --user pipenv
	cd deployment && \
		copy NUL backend.env
	cd backend/config/settings && \
		copy .env.example .env
	cd backend && \
		python3 -m pipenv sync --dev && \
		python3 -m pipenv run migrate && \
		SET DJANGO_SUPERUSER_PASSWORD=admin && \
		python3 -m pipenv run createsuperuser --noinput --username admin --email admin@ec-nantes.fr
	cd frontend && \
		npm install && \
		npm run build:dev

# Install the project for unix-systems: linux and macos
install-unix:
	python3 -m pip install -U --user pipenv
	cd deployment && \
		touch backend.env
	cd backend/config/settings && \
		cp .env.example .env
	cd backend && \
		python3 -m pipenv sync --dev && \
		python3 -m pipenv run migrate && \
		export DJANGO_SUPERUSER_PASSWORD=admin && \
		python3 -m pipenv run createsuperuser --noinput --username admin --email admin@ec-nantes.fr
	cd frontend && \
		npm install && \
		npm run build:dev

# Update after pull
update:
	cd backend && \
		python3 -m pipenv sync --dev && \
		python3 -m pipenv run migrate
	cd frontend && \
		npm install && \
		npm run build:dev

# Run the tests
test:
	cd backend && \
		python3 -m pipenv run test

# Run the server
runserver:
	python -c 'import webbrowser && webbrowser.open("localhost:8000")'
	cd backend && \
		python3 -m pipenv run start

# Test the quality of code
quality:
	flake8 --config setup.cfg ./backend

.PHONY: install-win install-unix test runserver quality
