import { pointerIntersection } from '@dnd-kit/collision';
import { useDroppable } from '@dnd-kit/react';
import { HighlightAlt as DropIcon } from '@mui/icons-material';
import { Stack, Typography, useTheme } from '@mui/material';
import { UUID } from 'crypto';

import { useTranslation } from '#shared/i18n/useTranslation';

export function DropLayoutPlaceHolder({
  parentId,
  accept,
}: {
  parentId: UUID;
  accept: string[];
}) {
  const { t } = useTranslation();

  const { ref } = useDroppable({
    id: 'drop-' + parentId,
    type: 'placeholder',
    accept,
    collisionDetector: pointerIntersection,
  });
  const theme = useTheme();
  return (
    <Stack
      border={`3px dashed ${theme.palette.divider}`}
      borderRadius={`${theme.shape.borderRadius}px`}
      sx={{
        backgroundColor: theme.palette.action.hover,
      }}
      ref={ref}
      minHeight={200}
      minWidth={100}
      width="100%"
      gap={2}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <DropIcon />
      <Typography variant="subtitle1" textAlign="center" maxWidth={300}>
        {t('jsonForm.edit.dropLayout')}
      </Typography>
    </Stack>
  );
}
