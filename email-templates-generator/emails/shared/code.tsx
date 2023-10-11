import { CSSProperties, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Code = ({ children }: Props) => <code style={style}>{children}</code>;

export default Code;

const style: CSSProperties = {
  backgroundColor: '#F0F0F0',
  fontFamily: 'monospace',
};
