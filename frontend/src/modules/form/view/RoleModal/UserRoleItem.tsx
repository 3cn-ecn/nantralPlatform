import { Close as CloseIcon } from '@mui/icons-material';
import InboxIcon from '@mui/icons-material/Inbox';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Avatar as MuiAvatar,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';

import { UserRole } from '#modules/form/types/jsonForm.type';
import { useUserDetails } from '#pages/StudentDetails/hooks/useUserDetails';
import { Avatar } from '#shared/components/Avatar/Avatar';

export function UserRoleItem({
  role,
  handleDelete,
  handleUpdate,
}: {
  role: UserRole;
  handleDelete: (id: number) => void;
  handleUpdate: (id: number, role: UserRole['role']) => void;
  isPending?: boolean;
}) {
  const { data: user, isSuccess } = useUserDetails(role.user);

  if (!isSuccess) {
    return (
      <ListItem>
        <ListItemAvatar>
          <MuiAvatar />
        </ListItemAvatar>
        <ListItemText primary={<Skeleton />} />
      </ListItem>
    );
  }

  return (
    <ListItem
      secondaryAction={
        <>
          <Select
            value={role.role}
            size="small"
            margin={'none'}
            sx={{ mr: 1 }}
            onChange={(e) =>
              handleUpdate(role.id, e.target.value as UserRole['role'])
            }
            disabled={role.role === 'owner'}
          >
            {role.role === 'owner' ? (
              <MenuItem value={'owner'}>Owner</MenuItem>
            ) : (
              [
                <MenuItem key={'editor'} value={'editor'}>
                  Editor
                </MenuItem>,
                <MenuItem key={'answer_viewer'} value={'answer_viewer'}>
                  Result Viewer
                </MenuItem>,
                <MenuItem key={'form_viewer'} value={'form_viewer'}>
                  Form Viewer
                </MenuItem>,
              ]
            )}
          </Select>
          <IconButton
            onClick={() => handleDelete(role.id)}
            disabled={role.role === 'owner'}
          >
            <CloseIcon />
          </IconButton>
        </>
      }
    >
      <ListItemAvatar>
        <Avatar src={user.picture} alt={user.name}>
          <InboxIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={user.name} />
    </ListItem>
  );
}
