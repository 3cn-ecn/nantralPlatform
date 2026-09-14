import { useMemo } from 'react';

import { Skeleton, TableCell, TableRow } from '@mui/material';

import { useCurrentUserData } from '#modules/account/hooks/useCurrentUser.data';
import { JsonFormPreview } from '#modules/form/types/jsonForm.type';
import { FormItemActions } from '#modules/form/view/shared/FormItemActions';
import { useTranslation } from '#shared/i18n/useTranslation';

export function FormListItem({
  formPreview,
}: {
  formPreview: JsonFormPreview;
}) {
  const { t } = useTranslation();

  const user = useCurrentUserData();
  const roles = useMemo(
    () => ({
      owner: t('jsonForm.roles.owner'),
      editor: t('jsonForm.roles.editor'),
      answer_viewer: t('jsonForm.roles.answerViewer'),
      form_viewer: t('jsonForm.roles.formViewer'),
    }),
    [t],
  );

  const userRole = formPreview.roles?.find(
    (role) => role.user === user.id,
  )?.role;

  return (
    <TableRow>
      <TableCell>{formPreview.name}</TableCell>
      <TableCell>{userRole && roles[userRole]}</TableCell>
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
