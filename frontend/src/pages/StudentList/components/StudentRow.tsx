import { Link } from 'react-router-dom';

import { TableCell, TableRow } from '@mui/material';

import { Curriculum, Faculties, Student } from '#modules/student/student.types';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { useTranslation } from '#shared/i18n/useTranslation';

interface StudentRowProps {
  student: Student;
}

export function StudentRow({ student }: StudentRowProps) {
  const { t } = useTranslation();
  return (
    <TableRow
      component={Link}
      to={student.url}
      key={student.id}
      sx={{ textDecoration: 'none' }}
    >
      <TableCell>
        <Avatar alt={student.name} src={student.picture} />
      </TableCell>
      <TableCell>{student.name}</TableCell>
      <TableCell>{student.promo}</TableCell>
      <TableCell>{t(Faculties[student.faculty])}</TableCell>
      <TableCell>{t(Curriculum[student.path])}</TableCell>
    </TableRow>
  );
}
