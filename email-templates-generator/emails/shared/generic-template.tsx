import { CSSProperties, PropsWithChildren } from 'react';

import {
  Body,
  Container,
  Heading,
  Hr,
  Img,
  Link,
  Section,
  Text,
} from '@react-email/components';

type Props = PropsWithChildren;

const GenericTemplate = ({ children }: Props) => (
  <Body style={main}>
    <Container style={headerContainer}>
      <Heading>
        <Img
          src="https://nantral-platform.fr/static/img/logo/android/android-launchericon-72-72.png"
          alt=""
          height="45"
          style={headerLogo}
        />
        Nantral Platform
      </Heading>
    </Container>
    <Hr style={{ display: 'none' }} />
    <Container style={mainContainer}>{children}</Container>
    <Hr style={{ display: 'none' }} />
    <Container style={footerContainer}>
      <Section>
        <Text style={footerText}>
          Cet email a été envoyé automatiquement par{' '}
          <Link
            href="https://nantral-platform.fr"
            rel="noopener"
            style={footerLink}
          >
            Nantral Platform
          </Link>
          . Si vous n&apos;attendiez pas d&apos;email de notre part, vous pouvez
          ignorer ce message. Pour toute question supplémentaire, merci de nous
          contacter de préférence via{' '}
          <Link
            href="https://www.facebook.com/nantral.platform.ecn"
            rel="noopener"
            style={footerLink}
          >
            notre page Facebook
          </Link>{' '}
          ou en répondant à cet email.
        </Text>
        <Text style={footerText}>
          Club 3CN - Association des Étudiants de Centrale Nantes, 1 rue de la
          Noë, 44321 Nantes, France
        </Text>
      </Section>
    </Container>
  </Body>
);

export default GenericTemplate;

const main: CSSProperties = {
  backgroundColor: '#fcf9f9',
  padding: '10px',
};

const headerContainer: CSSProperties = {
  margin: '0 auto',
  padding: '20px 0',
  textAlign: 'center',
};

const headerLogo: CSSProperties = {
  display: 'inline-block',
  verticalAlign: 'middle',
  marginRight: '5px',
  paddingBottom: '4px',
};

const mainContainer: CSSProperties = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '32px 48px 32px 48px',
  border: '1px solid #eee',
  borderRadius: '10px',
  boxShadow: '0 5px 10px rgba(20,50,70,.2)',
};

const footerContainer: CSSProperties = {
  color: '#656565',
  padding: '5px 15px 5px 15px',
  marginBottom: '64px',
};

const footerText: CSSProperties = {
  color: '#888080',
  fontSize: '12px',
  lineHeight: '16px',
};

const footerLink: CSSProperties = {
  color: '#888080',
  textDecoration: 'underline',
};
