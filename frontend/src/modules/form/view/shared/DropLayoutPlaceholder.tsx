import { pointerIntersection } from '@dnd-kit/collision';
import { useDroppable } from '@dnd-kit/react';
import { HighlightAlt as DropIcon } from '@mui/icons-material';
import { Typography, useTheme } from '@mui/material';
import { UUID } from 'crypto';

import { FlexCol } from '#shared/components/FlexBox/FlexBox';

export function DropLayoutPlaceHolder({
  parentId,
  accept,
}: {
  parentId: UUID;
  accept: string[];
}) {
  const { ref } = useDroppable({
    id: 'drop-' + parentId,
    type: 'placeholder',
    accept,
    collisionDetector: pointerIntersection,
  });
  const theme = useTheme();
  return (
    <FlexCol
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
        Déplacez un élément ici ou cliquez ci-dessous pour en ajouter un
      </Typography>
    </FlexCol>
  );
}
