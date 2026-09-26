import { Trans } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { DeleteForever, Edit, Preview, Restore } from '@mui/icons-material';
import {
  Link,
  ListItemAvatar,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';

import { GroupHistory } from '#modules/group/types/groupHistory.type';
import { HistoryIcon } from '#modules/group/view/EditHistoryView/components/HistoryIcon';
import { ResponsiveListItem } from '#shared/components/ResponsiveListItem/ResponsiveListItem';
import { useTranslation } from '#shared/i18n/useTranslation';

export interface Props {
  item: GroupHistory;
  onClickEdit: () => void;
  onClickDelete: () => void;
  onClickRestore: () => void;
  onClickView: () => void;
}

export function HistoryListItem({
  item,
  onClickEdit,
  onClickDelete,
  onClickRestore,
  onClickView,
}: Props) {
  const { t, formatRelativeTime } = useTranslation();
  const theme = useTheme();

  return (
    <ResponsiveListItem
      actions={[
        {
          label: t('group.details.modal.editHistory.edit'),
          onClick: onClickEdit,
          icon: <Edit />,
        },
        {
          label: t('group.details.modal.editHistory.restore'),
          onClick: onClickRestore,
          icon: <Restore />,
        },
        {
          label: t('group.details.modal.editHistory.delete'),
          onClick: onClickDelete,
          icon: <DeleteForever />,
        },
        {
          label: t('group.details.modal.editHistory.view'),
          onClick: onClickView,
          icon: <Preview />,
        },
      ]}
    >
      <ListItemAvatar>
        <HistoryIcon historyType={item.historyType} />
      </ListItemAvatar>
      <ListItemText
        primary={
          item.historyChangeReason ?? (
            <Typography
              color={theme.palette.text.disabled}
              sx={{ fontStyle: 'italic' }}
            >
              {t('group.details.modal.editHistory.noChangeReason')}
            </Typography>
          )
        }
        secondary={
          item.historyUser ? (
            <Trans
              i18nKey="group.details.modal.editHistory.timeAndUser"
              values={{
                user: item.historyUser.name,
                time: formatRelativeTime(item.historyDate),
              }}
              components={[
                <Link
                  component={RouterLink}
                  to={item.historyUser.url}
                  key={'link'}
                >
                  User
                </Link>,
              ]}
            />
          ) : (
            formatRelativeTime(item.historyDate)
          )
        }
      />
    </ResponsiveListItem>
  );
}
