import { CSSProperties, PropsWithChildren } from 'react';

import { Button, Container } from '@react-email/components';

type Props = PropsWithChildren & {
  href: string;
};

const BigButton = ({ href, children }: Props) => (
  <Container style={{ textAlign: 'center' }}>
    <Button href={href} rel="noopener" style={button}>
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
  padding: '10px 50px',
};
