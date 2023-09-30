# Email Template Generator

Generate email templates for Django!

## Getting Started

First, install the dependencies:

```sh
npm install
```

Then, run the development server:

```sh
npm run start
```

Open [localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Django

To make templates available for Django, simply run:

```sh
npm run build
```

It will create the templates in `.html` and `.txt` version: you can then use
them when calling `send_mail`.

## Using context variables

To pass variables from Django to the template, declare them in the email
as default values:

```tsx
type Props = {
  firstName?: string;
  validationLink?: string;
};

const ActivateYourAccountEmail = ({
  firstName = '{{user.first_name|title}}',
  validationLink = '{{validation_link}}',
}: Props) => (
  <Html>
    <Text>Bonjour {firstName} !</Text>
    <Text>
      Valide ton compte <Link href={validationLink}>ici</Link>
    </Text>
  </Html>
);
```

Be careful! We declare them as variables in the template to make it more
readable, but these are **not real variables**: you can't make operation
on them. They are just placeholders that will be replaced by Django.
