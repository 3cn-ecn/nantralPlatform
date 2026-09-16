import { useMemo } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
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
  Tooltip,
} from '@mui/material';

import { UserRole } from '#modules/form/types/jsonForm.type';
import { useUserDetails } from '#pages/StudentDetails/hooks/useUserDetails';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { useTranslation } from '#shared/i18n/useTranslation';

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
  const { t } = useTranslation();

  const { data: user, isSuccess } = useUserDetails(role.user);

  const items = useMemo(
    () => ({
      editor: {
        label: t('jsonForm.roles.editor'),
        helperText: t('jsonForm.roles.editorHelp'),
      },
      answer_viewer: {
        label: t('jsonForm.roles.answerViewer'),
        helperText: t('jsonForm.roles.answerViewerHelp'),
      },
      form_viewer: {
        label: t('jsonForm.roles.formViewer'),
        helperText: t('jsonForm.roles.formViewerHelp'),
      },
    }),
    [t],
  );

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
            renderValue={(val) =>
              items[val]?.label ?? t('jsonForm.roles.owner')
            }
          >
            {role.role === 'owner' ? (
              <MenuItem value={'owner'}>{t('jsonForm.roles.owner')}</MenuItem>
            ) : (
              Object.entries(items).map(([id, item]) => (
                <MenuItem key={id} value={id}>
                  <ListItemText
                    sx={{ textWrap: 'wrap', maxWidth: 400 }}
                    primary={item.label}
                    secondary={item.helperText}
                  />
                </MenuItem>
              ))
            )}
          </Select>
          <Tooltip title={t('button.delete')}>
            <IconButton
              onClick={() => handleDelete(role.id)}
              disabled={role.role === 'owner'}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
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
