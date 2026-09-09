import { Skeleton, TableCell, TableRow } from '@mui/material';

import { useCurrentUserData } from '#modules/account/hooks/useCurrentUser.data';
import { JsonFormPreview } from '#modules/form/types/jsonForm.type';
import { FormItemActions } from '#modules/form/view/shared/FormItemActions';

export function FormListItem({
  formPreview,
}: {
  formPreview: JsonFormPreview;
}) {
  const user = useCurrentUserData();
  return (
    <TableRow>
      <TableCell>{formPreview.name}</TableCell>
      <TableCell>
        {formPreview.roles?.find((role) => role.user === user.id)?.role}
      </TableCell>
      <TableCell>
        <FormItemActions formPreview={formPreview} />
      </TableCell>
    </TableRow>
  );
}

export function FormListItemSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton variant={'text'} />
      </TableCell>
      <TableCell>
        <Skeleton variant={'text'} />
      </TableCell>
      <TableCell>
        <Skeleton variant={'rounded'} />
      </TableCell>
    </TableRow>
  );
}
