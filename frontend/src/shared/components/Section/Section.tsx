import { PropsWithChildren, ReactNode } from 'react';

import { Box, Typography, styled } from '@mui/material';

import { FlexRow } from '../FlexBox/FlexBox';

type SectionProps = PropsWithChildren & {
  title: string;
  button?: ReactNode;
};

export function Section({ title, button, children }: SectionProps) {
  return (
    <Box marginBottom={3}>
      <Header>
        <Typography variant="h3">{title}</Typography>
        {button}
      </Header>
      {children}
    </Box>
  );
}

const Header = styled(FlexRow)({
  flexWrap: 'wrap',
  rowGap: 4,
  columnGap: 16,
  alignItems: 'center',
  marginBottom: 8,
});
