import { Link, useParams } from 'react-router';

import ViewIcon from '@mui/icons-material/Visibility';
import {
  Skeleton,
  TableCell,
  TableRow,
  Typography,
  Avatar as MuiAvatar,
  Tooltip,
  IconButton,
  Link as MuiLink,
} from '@mui/material';

import { JsonFormAnswerPreview } from '#modules/form/types/jsonForm.type';
import { useUserDetails } from '#pages/StudentDetails/hooks/useUserDetails';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';

export function AnswerListItem({ answer }: { answer: JsonFormAnswerPreview }) {
  const { t, formatDateTime } = useTranslation();
  const showToast = useToast();

  const { uuid } = useParams();

  const userQuery = useUserDetails(answer.user);
  if (userQuery.isError)
    showToast({ variant: 'error', message: t('jsonForm.answers.userError') });

  if (!userQuery.isSuccess) return <AnswerListItemSkeleton />;

  return (
    <TableRow>
      <TableCell>
        <Avatar alt={userQuery.data.name} src={userQuery.data.picture} />
      </TableCell>
      <TableCell>
        <Typography>
          <MuiLink component={Link} to={userQuery.data.url}>
            {userQuery.data.name}
          </MuiLink>
        </Typography>
      </TableCell>
      <TableCell>{formatDateTime(answer.modifiedAt)}</TableCell>
      <TableCell>
        <Tooltip title={t('jsonForm.answers.viewDetails')}>
          <IconButton
            component={Link}
            to={`/form/${uuid}/answers/${answer.uuid}/`}
          >
            <ViewIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export function AnswerListItemSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton variant={'circular'}>
          <MuiAvatar />
        </Skeleton>
      </TableCell>
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
