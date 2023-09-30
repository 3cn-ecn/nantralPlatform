import { CSSProperties } from 'react';

import { Link } from '@react-email/components';

const Link3CN = () => (
  <Link href="https://github.com/3cn-ecn" style={link}>
    3CN
  </Link>
);

export default Link3CN;

const link: CSSProperties = {
  color: '#DC3545',
};
