import { Link } from 'react-router-dom';

import { TableCell, TableRow } from '@mui/material';

import { Curriculum, Faculties, User } from '#modules/account/user.types';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { useTranslation } from '#shared/i18n/useTranslation';

interface StudentRowProps {
  user: User;
}

export function StudentRow({ user }: StudentRowProps) {
  const { t } = useTranslation();
  return (
    <TableRow
      component={Link}
      to={user.url}
      key={user.id}
      sx={{ textDecoration: 'none' }}
    >
      <TableCell>
        <Avatar alt={user.name} src={user.picture} />
      </TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.promo}</TableCell>
      <TableCell>{t(Faculties[user.faculty])}</TableCell>
      <TableCell>{t(Curriculum[user.path])}</TableCell>
    </TableRow>
  );
}
