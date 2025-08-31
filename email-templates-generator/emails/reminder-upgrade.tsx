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

type Props = {
  firstName?: string;
  deadline?: string;
  changeEmailLink?: string;
};

const ResetPasswordEmail = ({
  firstName = '{{first_name|title}}',
  deadline = '{{deadline}}',
  changeEmailLink = '{{change_email_link}}',
}: Props) => (
  <Html lang="fr">
    <HeadWithFont />
    <Preview>Comptes personnels bientôt supprimés</Preview>
    <GenericTemplate>
      <Section>
        <Heading as="h2">
          <LanguageFlag lang="fr" />
          Passage à un compte permanent
        </Heading>
        <Text>Bonjour {firstName},</Text>
        <Text>
          Puisque vous avez créé votre compte avec votre adresse personnelle
          (autre que celle de centrale), nous vous informons que vous avez
          jusqu&apos;au {deadline} pour renseigner votre adresse de Centrale.
          Après cette date, vous n&apos;aurez plus accès à votre compte si votre
          adresse mail n&apos;a pas été modifiée.
        </Text>
        <Text>
          Le changement de mail se fait en cliquant sur le lien suivant
        </Text>
        <BigButton href={changeEmailLink}>Changer mon email</BigButton>
        <Text>Merci de votre confiance,</Text>
        <Text>
          La Team <Link3CN />
        </Text>
      </Section>
      <Hr />
      <Section>
        <Heading as="h2">
          <LanguageFlag lang="en" />
          Upgrade to a permanent account
        </Heading>
        <Text>Hello {firstName},</Text>
        <Text>
          If you created your account with your personal address (other than the
          Centrale address), please note that you have until {deadline} to fill
          in your Centrale address. After this date, you will not have access to
          your account if the email address has not been updated.
        </Text>
        <Text>To change your email address, click on the link below</Text>
        <BigButton href={changeEmailLink}>Change my email</BigButton>
        <Text>Thank you for your trust,</Text>
        <Text>
          The <Link3CN /> team
        </Text>
      </Section>
    </GenericTemplate>
  </Html>
);

export default ResetPasswordEmail;
