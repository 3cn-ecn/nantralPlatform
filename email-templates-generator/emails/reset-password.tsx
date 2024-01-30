import {
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

import BigButton from './_components/big-button';
import GenericTemplate from './_components/generic-template';
import HeadWithFont from './_components/head-with-font';
import LanguageFlag from './_components/language-flag';
import Link3CN from './_components/link-3cn';
import RedLink from './_components/red-link';

type Props = {
  firstName?: string;
  email?: string;
  resetPasswordLink?: string;
  updatePasswordLink?: string;
};

const ResetPasswordEmail = ({
  firstName = '{{first_name|title}}',
  email = '{{email}}',
  resetPasswordLink = '{{reset_password_link}}',
  updatePasswordLink = '{{update_password_link}}',
}: Props) => (
  <Html lang="fr">
    <HeadWithFont />
    <Preview>
      Une demande de réinitialisation du mot de passe a été soumise pour le
      compte {email}.
    </Preview>
    <GenericTemplate>
      <Section>
        <Heading as="h2">
          <LanguageFlag lang="fr" />
          Réinitialisation du mot de passe
        </Heading>
        <Text>Bonjour {firstName},</Text>
        <Text>
          Une demande de réinitialisation du mot de passe a été soumise pour le
          compte {email}.
        </Text>
        <Text>
          Si vous n&apos;êtes pas à l&apos;origine de la demande, quelqu&apos;un
          essaie peut-être de se connecter à votre compte : dans ce cas, merci
          de{' '}
          <RedLink href={updatePasswordLink}>
            modifier votre mot de passe
          </RedLink>{' '}
          au plus vite par sécurité. Sinon, cliquez sur le lien suivant pour
          continuer :
        </Text>
        <BigButton href={resetPasswordLink}>
          Réinitialiser mon mot de passe
        </BigButton>
        <Text>Merci de votre confiance,</Text>
        <Text>
          La Team <Link3CN />
        </Text>
      </Section>
      <Hr />
      <Section>
        <Heading as="h2">
          <LanguageFlag lang="en" />
          Password reset
        </Heading>
        <Text>Hello {firstName},</Text>
        <Text>
          A password reset request has been submitted for the {email} account.
        </Text>
        <Text>
          If you are not the originator of the request, someone may be trying to
          connect to your account. If this is the case, please{' '}
          <RedLink href={updatePasswordLink}>change your password</RedLink> as
          soon as possible to be on the safe side. Otherwise, click on the
          following link to continue:
        </Text>
        <BigButton href={resetPasswordLink}>Reset my password</BigButton>
        <Text>Thank you for your trust,</Text>
        <Text>
          The <Link3CN /> team
        </Text>
      </Section>
    </GenericTemplate>
  </Html>
);

export default ResetPasswordEmail;
