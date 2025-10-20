import { ReactNode } from 'react';

import { Box, Card, CssBaseline } from '@mui/material';

import { FloatingContainer } from '#shared/components/FloatingContainer/FloatingContainer';
import '#shared/components/PageTemplate/UnauthenticatedPage.scss';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { Controls } from './components/Controls';

export function CardTemplate({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
      <Box className={'content'} style={{ position: 'fixed' }}>
        <Box className="blur"></Box>
      </Box>

      <CssBaseline />
      <FloatingContainer maxWidth={'sm'}>
        <Card
          sx={{
            padding: 5,
          }}
        >
          <Controls />
          <Spacer vertical={2} />
          {children}
        </Card>
      </FloatingContainer>
    </Box>
  );
}
