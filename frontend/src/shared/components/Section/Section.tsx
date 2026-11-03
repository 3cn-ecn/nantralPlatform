import { PropsWithChildren, ReactNode } from 'react';

import { Box, Typography, styled, Stack } from '@mui/material';

type SectionProps = PropsWithChildren & {
  title: string;
  button?: ReactNode;
};

export function Section({ title, button, children }: SectionProps) {
  return (
    <Box sx={{ marginBottom: 3 }}>
      <Header>
        <Typography variant="h2">{title}</Typography>
        {button}
      </Header>
      {children}
    </Box>
  );
}

const Header = styled(Stack)({
  flexWrap: 'wrap',
  flexDirection: 'row',
  rowGap: 4,
  columnGap: 16,
  alignItems: 'center',
  marginBottom: 8,
});
