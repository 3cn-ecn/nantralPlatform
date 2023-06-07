---
last_update:
  date: 2023-02-07 14:58:56 +0100
  author: Alexis Delage
title: Emails
description: "A comprehensive description of how mails are handled on the server"
---

# Emails

## Sending emails in Django

The prefered method for sending mails to user is the [`email_user`](https://docs.djangoproject.com/fr/4.0/ref/contrib/auth/#django.contrib.auth.models.User.email_user) method of the [`User`](https://docs.djangoproject.com/fr/4.0/ref/contrib/auth/#user-model) model. An example can be found [here](https://github.com/3cn-ecn/nantralPlatform/blob/019a4f2516de157150bd1be09d1bcfda902f9e09/backend/apps/account/models.py#L66-L67).

If you need to send an email without having the user object, you can use Django's built-in [`send_mail`](https://docs.djangoproject.com/fr/4.0/topics/email/#send-mail) method. A detailed example is available [here](https://docs.djangoproject.com/fr/4.0/topics/email/).

By default, all emails (except the ones sent to ADMINS and MANAGERS) are sent from `no-reply@nantral-platform.fr` which is defined by the [`DEFAULT_FROM_EMAIL`](https://docs.djangoproject.com/fr/4.0/ref/settings/#default-from-email) setting. For the rest, they are sent from `admin@nantral-platform.fr` which is defined by the [`SERVER_EMAIL`](https://docs.djangoproject.com/fr/4.0/ref/settings/#server-email) setting.

There is no authentification between Django and the SMTP server as they both operate on the same host. This means that any email adress ending in `@nantral-platform.fr` is valid (`foo@nantral-platform.fr`, `bar@nantral-platform.fr`, etc). You do not need to create it in order to use it.

:::info
We have chosen to use `no-reply@nantral-platform.fr` wherever possible in order to avoid a possible confusion with pishing adresses from our users.
:::

:::caution
In order to avoid being flagged as SPAM, we should avoid sending more than 30-50 emails at once, especially to `@ec-nantes.fr`, which is more restrictive than big email providers such as Google.
:::

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
