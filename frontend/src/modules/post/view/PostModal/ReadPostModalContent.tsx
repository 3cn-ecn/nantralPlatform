import {
  Edit as EditIcon,
  Group as GroupIcon,
  PushPin as PushPinIcon,
} from '@mui/icons-material';
import { Box, Container, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton/IconButton';

import { Post } from '#modules/post/post.types';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import {
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { BadgeIcon } from '../shared/BadgeIcon';

type ReadPostModalContentProps = {
  post: Post;
  onClose: () => void;
  onEdit: () => void;
};

export function ReadPostModalContent({
  post,
  onClose,
  onEdit,
}: ReadPostModalContentProps) {
  const { t, formatRelativeTime } = useTranslation();

  return (
    <>
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={
          <IconButton href={post?.group.url} sx={{ p: 0 }}>
            {post?.group?.name && (
              <Avatar title={post.group.name} url={post.group.icon} size="m" />
            )}
          </IconButton>
        }
      >
        <Box>
          <Typography variant="h6" sx={{ lineHeight: 1, mb: '4px' }}>
            {post.title}
          </Typography>
          <Typography variant="caption" component="p" sx={{ lineHeight: 1 }}>
            {post.group.name}
          </Typography>
        </Box>
        <Spacer flex={1} />
        <FlexRow gap={2}>
          {post.publicity === 'Mem' && <BadgeIcon Icon={GroupIcon} />}
          {post.pinned && <BadgeIcon Icon={PushPinIcon} />}
        </FlexRow>
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent sx={{ p: 0 }}>
        {post.image && (
          <img alt="" src={post.image.toString()} style={{ width: '100%' }} />
        )}
        <Container
          dangerouslySetInnerHTML={{ __html: post.description }}
        ></Container>
      </ResponsiveDialogContent>
      <ResponsiveDialogFooter sx={{ justifyContent: 'space-between', pl: 3 }}>
        <Typography variant="caption" color="text.secondary" fontStyle="italic">
          {`${t('post.modal.metadata.dates', {
            createdDuration: formatRelativeTime(post.createdAt),
            updatedDuration: formatRelativeTime(post.updatedAt),
          })}`}
        </Typography>
        {post.isAdmin && (
          <Tooltip title={t('post.modal.editButton.label')}>
            <IconButton color="secondary" onClick={onEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
      </ResponsiveDialogFooter>
    </>
  );
}
