import { Heading, Hr, Html, Section, Text } from '@react-email/components';

import GenericTemplate from './_components/generic-template';
import HeadWithFont from './_components/head-with-font';
import LanguageFlag from './_components/language-flag';
import Link3CN from './_components/link-3cn';

type Props = {
  firstName?: string;
  deletedEmail?: string;
  newEmail?: string;
};

const EmailDeletedEmail = ({
  firstName = '{{first_name|title}}',
  deletedEmail = '{{deleted_email}}',
  newEmail = '{{new_email}}',
}: Props) => (
  <Html lang="fr">
    <HeadWithFont />
    <GenericTemplate>
      <Section>
        <Heading as="h2">
          <LanguageFlag lang="fr" />
          Adresse email principale modifiée
        </Heading>
        <Text>Bonjour {firstName},</Text>
        <Text>
          L&apos;adresse {deletedEmail} a été supprimée de votre compte
          Nantral Platform. Votre nouvelle adresse pour vous cennecter
          est {newEmail}.
        </Text>
        <Text>
          Si vous n&apos;êtes pas à l&apos;origine de cette modification,
          veuillez contacter la <Link3CN />.
        </Text>
      </Section>
      <Hr />
      <Section>
        <Heading as="h2">
          <LanguageFlag lang="en" />
          Primary email address changed
        </Heading>
        <Text>Hello {firstName},</Text>
        <Text>
          The address {deletedEmail} was removed from your Nantral Platform
          account. Your new address for login is {newEmail}.
        </Text>
        <Text>
          If you did not make this change, please contact the <Link3CN />.
        </Text>
      </Section>
    </GenericTemplate>
  </Html>
);

export default EmailDeletedEmail;
