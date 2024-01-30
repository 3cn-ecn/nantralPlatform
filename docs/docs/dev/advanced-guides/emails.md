---
title: Send Emails
sidebar_position: 2
---

# How to send emails?

This guide describe how to send emails from the Nantral Platform website.

## 1️⃣ Create your email template

First, create your email template with [react-email](https://react.email/docs/introduction):

- Go into the `email-templates-generator` folder:
  ```bash
  cd email-templates-generator
  ```
- Start the preview server (this is not required, but it is very helpful):
  ```bash
  npm run start
  ```
  > You can preview your email at [http://localhost:3000](http://localhost:3000)
- Create a new email template in the `emails` folder, by copying an existing
  template (for example at the moment we have `email-confirmation.tsx` and
  `reset-password.tsx`), and edit it to your liking!
  :::success
  You can check [the documentation](https://react.email/docs/introduction) to
  know the available components. Do not use standard HTML tags!
  :::
- Once you're happy with the result, compile the template to an HTML file:

  ```bash
  npm run build
  ```

  :::info
  The `build` command creates 2 files: an HTML file and TXT file. This is
  because we need to send them both in an email, given that some email client
  do not support HTML emails.
  These 2 files are created in the `backend/templates/emails` folder.
  :::

## 2️⃣ Send your email from Django

To send the email from the backend, you need to call this function
from `backend/apps/utils/send_email.py`:

```python
def send_email(
    subject: str,  # The subject of the email
    to: str,  # The email address of the recipient
    template_name: str,  # The name of the template
    context: Optional[dict[str, Any]] = None,  # The context object
) -> int:
```

For example, if we call:

```python
send_email(
  subject="Hello world",
  to="toto@example.org",
  template_name="email-confirmation",
)
```

This will send an email to `toto@example.org` with the subject `"Hello world"`,
and the content of the email will be the template file located in
`email-templates-generator/emails/email-confirmation.tsx`. The email will be
sent from the address `no-reply@nantral-platform.fr`. The function then
returns 0 if the email was sent successfully, or 1 if an error occurred.

If you want to send an email to multiple users at the same time, you can
use the function `send_mass_email` from the same file.

:::caution
In order to avoid being flagged as SPAM, we should avoid sending more than 30-50 emails at once, especially to `@ec-nantes.fr`, which is more restrictive than big email providers such as Google.
:::

## 3️⃣ Passing context data from django to the email template

If you want to customize your template for the user to which you send the mail,
you can pass some context data to the template.

Here is a quick start example:

```tsx title="email-templates-generator/emails/example-email.tsx"
type Props = {
  firstName?: string;
  validationLink?: string;
};
const ActivateYourAccountEmail = ({
  firstName = '{{first_name|title}}',
  validationLink = '{{validation_link}}',
}: Props) => (
  <Html>
    <Text>Bonjour {firstName} !</Text>
    <Text>
      Valide ton compte <Link href={validationLink}>en cliquant ici ici</Link>
    </Text>
  </Html>
);
```

Then, in your python code:

```python
send_email(
  subject="Hello world",
  to="toto@example.org",
  template_name="example-email",
  context={
    "first_name": "Toto",
    "validation_link": "https://nantral-platform.fr/validation/123456789",
  },
)
```

:::note Some things to know...

- The name of the django context variables must be put in strings, with
  double-brackets (`{{variable_name}}`), in the React template. This is because
  the template with context data is compiled by Django, and not React.

- You can still use django filters and tags in the variable template (for
  example `{{user.first_name|title}}`).

- If you need to send a link to the website, do not hard-code the domain name
  `nantral-platform.fr`: instead, use the django method
  `request.build_absolute_uri('/some/path')` to build the URL. This allows us to
  use the correct domain name in development, staging and production.

:::

## 4️⃣ Test your email

We already seen that you can preview your email in the browser, but you must
have noticed that this preview does not include the context data.

To test your email during runtime, you have 2 options:

1. Use [Docker](./docker) to locally run the server:

   - Launch the website locally with docker:
     ```bash
     cd deployment
     docker compose build
     docker compose up
     ```
   - Go to [http://localhost](http://localhost) and create a new account
     (your local account already created will not work, because you are
     using a different database in docker-mode).
   - Go to [http://localhost:8025](http://localhost:8025): this is a fake email
     server that will run locally. All emails sent from django in local with
     docker should be redirected here. You should also have received the email
     to validate the account created at the previous step.

   ➡️ Find more info on the [Docker](./docker) page.

2. Use the [Staging Server](./staging-server): this method is easier, but be
   aware that you will use the real email server, so be sure to not send test
   emails to other users!

## 🛟 F.A.Q.

### Can I send an email from the React frontend?

No, you can't. If you wish to make this, you need to create an API route in
Django that send an email, and then call this route in the React frontend.

### The backend crashes when I try to send an email

Check that:

- you have compiled the email template with `npm run build` (for local dev only,
  this is done automatically in production)
- the name of the template in the `send_email` function is correct (you should
  not include the `.tsx`, `.html`, or `.txt` extension)
