import { CSSProperties } from 'react';

import { Link, LinkProps } from '@react-email/components';

type Props = Omit<LinkProps, 'style' | 'rel'>;

const RedLink = (props: Props) => (
  <Link rel="noopener" style={redLink} {...props} />
);

export default RedLink;

const redLink: CSSProperties = {
  color: '#DC3545',
};
