import { ReactNode } from 'react';

import { ArrowForward } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  SxProps,
  useTheme,
} from '@mui/material';

interface LargeBigButtonProps {
  onClick: () => void;
  color?: 'primary' | 'secondary';
  sx?: SxProps;
  children: ReactNode;
}

export function LargeBigButton({
  onClick,
  color,
  sx,
  children,
}: LargeBigButtonProps) {
  const theme = useTheme();

  return (
    <Card
      sx={
        color && {
          borderColor: theme.palette[color].light,
          color: theme.palette[color].main,
        }
      }
    >
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Stack
            direction="row"
            spacing={2}
            sx={[
              {
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              ...(Array.isArray(sx) ? sx : [sx]),
            ]}
          >
            <Box>{children}</Box>
            <ArrowForward />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
