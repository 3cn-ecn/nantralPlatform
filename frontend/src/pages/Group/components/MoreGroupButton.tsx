import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';

import { FlexCol } from '#shared/components/FlexBox/FlexBox';

export function MoreGroupButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <FlexCol alignItems={'center'} justifyContent={'center'} height={'100%'}>
      <Fab onClick={onClick} variant="extended" sx={{ fontSize: 20 }}>
        <Add />
        {count}
      </Fab>
    </FlexCol>
  );
}
