---
description: 'A comprehensive description of how mails are handled on the server'
---

# Email server

To be able to send and receive emails with the `@nantral-platform.fr` domain,
we need an email server. This server runs on the same server as the Nantral
Platform website.

## Accessing the webmail

The webmail is available at [`https://webmail.nantral-platform.fr/`](https://webmail.nantral-platform.fr/). There are currently 3 email accounts:

- contact@nantral-platform.fr
- group-manager@nantral-platform.fr
- admin@nantral-platform.fr

## Accessing the webmail administration page

The webmail administration page is available at [`https://webmail.nantral-platform.fr/admin`](https://webmail.nantral-platform.fr/admin) with the `admin@nantral-platform.fr` email.

To manage the accounts, you can login into this interface and go to `domains -> users (mail icon)`.

Detailed administration on this interface is available [on the Mailu website](https://mailu.io/1.9/webadministration.html).

## Architecture details

We use [Mailu 1.9](https://mailu.io/) with Docker to handle our emails. This includes the following Docker containers:

- front
- resolver
- admin
- imap
- smtp
- antispam
- fetchmail
- webmail

The SSL certificates are the ones used by our entire platform. We pass them to the container [when they are updated with Certbot](https://github.com/3cn-ecn/nantralPlatform/blob/da9649ad35d4379293d7ee0dbc6e921c490596dd/deployment/certbot-renew.sh#L27-L28) and [during deployment](https://github.com/3cn-ecn/nantralPlatform/blob/da9649ad35d4379293d7ee0dbc6e921c490596dd/.github/workflows/deploy.yml#L139-L140).

The emails and accounts are stored on our Postgresql database.

There is no authentification between Django and the SMTP server as they both operate on the same host. This means that any email adress ending in `@nantral-platform.fr` is valid (`foo@nantral-platform.fr`, `bar@nantral-platform.fr`, etc). You do not need to create it in order to use it.
