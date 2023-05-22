import React, { PropsWithChildren, ReactNode } from 'react';

import { Box, Divider, Typography, styled } from '@mui/material';

type SectionProps = PropsWithChildren & {
  title: string;
  button?: ReactNode;
};

export function Section({ title, button, children }: SectionProps) {
  return (
    <Box marginBottom={3}>
      <Header>
        <Typography variant="h4">{title}</Typography>
        {button}
      </Header>
      <Divider sx={{ marginBottom: 1 }} />
      {children}
    </Box>
  );
}

const Header = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});
