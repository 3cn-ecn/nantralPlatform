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
  validationLink?: string;
};

const EmailConfirmationEmail = ({
  firstName = '{{first_name|title}}',
  validationLink = '{{validation_link}}',
}: Props) => (
  <Html lang="fr">
    <HeadWithFont />
    <Preview>
      Bienvenue sur Nantral Platform ! Active cette adresse en cliquant sur le
      lien suivant.
    </Preview>
    <GenericTemplate>
      <Section>
        <Heading as="h2">
          <LanguageFlag lang="fr" />
          Nouvelle adresse mail sur Nantral Platform !
        </Heading>
        <Text>Hello {firstName},</Text>
        <Text>
          Merci d&apos;utiliser Nantral Platform ! Pour activer cette adresse
          mail et profiter de toutes les fonctionnalités de la plateforme,
          clique sur le bouton ci-dessous :
        </Text>
        <BigButton href={validationLink}>Valider cette adresse</BigButton>
        <Text>À très vite sur la plateforme nantralienne !</Text>
        <Text>
          La Team <Link3CN />
        </Text>
      </Section>
      <Hr />
      <Section>
        <Heading as="h2">
          <LanguageFlag lang="en" />
          New Email Address on Nantral Platform!
        </Heading>
        <Text>Hi {firstName},</Text>
        <Text>
          Thanks for using Nantral Platform! To activate this email address and
          enjoy all the features of the platform, click the button below:
        </Text>
        <BigButton href={validationLink}>Confirm my account</BigButton>
        <Text>See you soon on the Nantralian platform!</Text>
        <Text>
          The <Link3CN /> team
        </Text>
      </Section>
    </GenericTemplate>
  </Html>
);

export default EmailConfirmationEmail;
