import { Link } from 'react-router-dom';

import {
  Edit as EditIcon,
  Group as GroupIcon,
  PushPin as PushPinIcon,
} from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';

import { Post } from '#modules/post/post.types';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import {
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { RichTextRenderer } from '#shared/components/RichTextRenderer/RichTextRenderer';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { BadgeIcon } from '../shared/BadgeIcon';

interface ReadPostModalContentProps {
  post: Post;
  onClose: () => void;
  onEdit: () => void;
}

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
          <IconButton
            component={Link}
            to={post.group.url}
            reloadDocument
            sx={{ p: 0.5 }}
          >
            <Avatar src={post.group.icon} alt={post.group.shortName} />
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
          <img
            alt=""
            src={post.image}
            style={{ maxWidth: '100%', flexShrink: 0 }}
          />
        )}
        <Box paddingX={3} paddingTop={1} paddingBottom={6}>
          <RichTextRenderer content={post.description} />
        </Box>
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
