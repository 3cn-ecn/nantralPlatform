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
      Bienvenue sur Nantral Platform ! Active ton compte en cliquant sur le lien
      suivant.
    </Preview>
    <GenericTemplate>
      <Section>
        <Heading as="h2">
          <LanguageFlag lang="fr" />
          Bienvenue sur Nantral Platform !
        </Heading>
        <Text>Hello {firstName},</Text>
        <Text>
          Nous sommes ravis de t&apos;accueillir sur Nantral Platform ! Pour
          pouvoir profiter de tous les avantages offerts par le site, valide ton
          compte dès maintenant en cliquant sur le bouton ci-dessous :
        </Text>
        <BigButton href={validationLink}>Valider mon compte</BigButton>
        <Text>À très vite sur la plateforme nantralienne !</Text>
        <Text>
          La Team <Link3CN />
        </Text>
      </Section>
      <Hr />
      <Section>
        <Heading as="h2">
          <LanguageFlag lang="en" />
          Welcome to Nantral Platform!
        </Heading>
        <Text>Hi {firstName},</Text>
        <Text>
          We&apos;re delighted to welcome you to Nantral Platform! To take
          advantage of all the benefits offered by the site, confirm your
          account now by clicking on the button below:
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
