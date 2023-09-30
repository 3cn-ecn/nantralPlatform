import { CSSProperties, PropsWithChildren } from 'react';

import { Button, Container } from '@react-email/components';

type Props = PropsWithChildren & {
  href: string;
};

const BigButton = ({ href, children }: Props) => (
  <Container style={{ textAlign: 'center' }}>
    <Button href={href} style={button} pX={50} pY={10}>
      {children}
    </Button>
  </Container>
);

export default BigButton;

const button: CSSProperties = {
  backgroundColor: '#DC3545',
  borderRadius: '50px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'block',
};
