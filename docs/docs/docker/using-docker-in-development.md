---
title: Using Docker in development
sidebar_position: 1
---

> This section doesn't work at the moment, as some dependencies seem to be missing.
> {.is-danger}

# Using Docker in development

Rather than using the stock Django development server, you can use Docker instead, in order to emulate the production environment. This might be useful for debugging serving static files, but that's it.

- In deployement_templates/local start the database with `docker-compose up -d`
- In the server folder activate your env with `source env/bin/activate`.
- Start the server with `python3 manage.py runserver`.
