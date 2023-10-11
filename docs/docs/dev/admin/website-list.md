# List of websites

Here is a complete list of websites used for the project Nantral Platform.

| Website                                      | Dev mode                                | Docker dev mode          | Prod mode                                                              |
| -------------------------------------------- | --------------------------------------- | ------------------------ | ---------------------------------------------------------------------- |
| _Command to start each website_              | _`pipenv run start` or `npm run start`_ | _`docker-compose up`_    | _`docker-compose -f docker-compose.yml -f docker-compose.prod.yml up`_ |
| Nantral Platform website                     | <http://localhost:8000>                 | <http://localhost>       | <https://nantral-platform.fr>                                          |
| Nantral Platform admin interface             | <http://localhost:8000/admin>           | <http://localhost/admin> | <https://nantral-platform.fr/admin>                                    |
| Nantral Platform Staging server              | -                                       | -                        | <https://dev.nantral-platform.fr>                                      |
| Documentation                                | <http://localhost:3000>                 | -                        | <https://docs.nantral-platform.fr>                                     |
| React-Email (for generating email templates) | <http://localhost:3000>                 | -                        | -                                                                      |
| Mailpit (for testing mails)                  | -                                       | <http://localhost:8025>  | -                                                                      |
| Flower (celery tasks dashboard)              | -                                       | <http://localhost:5555>  | -                                                                      |
| Webmail                                      | -                                       | -                        | <https://webmail.nantral-platform.fr>                                  |
| Webmail admin interface                      | -                                       | -                        | <https://webmail.nantral-platform.fr/admin>                            |
