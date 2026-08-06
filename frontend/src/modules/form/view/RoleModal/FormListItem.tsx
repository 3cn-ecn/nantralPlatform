import { Link } from 'react-router';

import {
  ListAlt as FormIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  List as ResultsIcon,
  Visibility as ViewIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import {
  TableCell,
  TableRow,
  Avatar,
  Tooltip,
  IconButton,
} from '@mui/material';

import { useCurrentUserData } from '#modules/account/hooks/useCurrentUser.data';
import { JsonFormPreview } from '#modules/form/types/jsonForm.type';
import { buildAbsoluteUrl } from '#shared/utils/urls';

export function FormListItem({
  formPreview,
  handleShare,
  handleRemove,
}: {
  formPreview: JsonFormPreview;
  handleShare: () => void;
  handleRemove: () => void;
}) {
  const user = useCurrentUserData();
  return (
    <TableRow>
      <TableCell>
        <Avatar>
          <FormIcon />
        </Avatar>
      </TableCell>
      <TableCell>{formPreview.name}</TableCell>
      <TableCell>{formPreview.description}</TableCell>
      <TableCell>
        {formPreview.roles.find((role) => role.user === user.id)?.role}
      </TableCell>
      <TableCell>
        <Tooltip title={'Preview form'}>
          <IconButton
            aria-label="preview form"
            component={Link}
            to={`/form/${formPreview.uuid}/`}
          >
            <ViewIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={'View results'}>
          <IconButton
            aria-label="view results"
            component={Link}
            to={`/form/${formPreview.uuid}/results/`}
          >
            <ResultsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton
            aria-label="edit"
            component={Link}
            to={`/form/${formPreview.uuid}/edit/`}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Share">
          <IconButton aria-label="share" onClick={handleShare}>
            <ShareIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={handleRemove}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Copy link'}>
          <IconButton
            aria-label="copy link"
            onClick={() =>
              window.navigator.clipboard.writeText(
                buildAbsoluteUrl(`/form/${formPreview.uuid}/`),
              )
            }
          >
            <LinkIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
