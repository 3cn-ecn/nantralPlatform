import { ReactNode } from 'react';

import { ArrowForward } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  SxProps,
  useTheme,
} from '@mui/material';

import { FlexRow } from '../FlexBox/FlexBox';

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
          <FlexRow
            justifyContent="space-between"
            alignItems="center"
            gap={2}
            sx={sx}
          >
            <Box>{children}</Box>
            <ArrowForward />
          </FlexRow>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
