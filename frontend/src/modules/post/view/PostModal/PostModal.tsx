import React from 'react';

import {
  Close,
  Edit as EditIcon,
  Group as GroupIcon,
  PushPin as PushPinIcon,
} from '@mui/icons-material';
import {
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import IconButton from '@mui/material/IconButton/IconButton';

import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexBox } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { usePostDetailsQuery } from '../hooks/usePostDetails.query';
import { BadgeIcon } from '../shared/BadgeIcon';

type PostModalProps = {
  postId: number;
  onClose: () => void;
  onEdit: () => void;
};

export function PostModal({ postId, onClose, onEdit }: PostModalProps) {
  const theme = useTheme();
  const { t, formatRelativeTime } = useTranslation();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { post, isLoading, isError } = usePostDetailsQuery(postId);

  if (isLoading || isError) {
    return null;
  }

  return (
    <Dialog
      open
      onClose={onClose}
      scroll="paper"
      fullWidth
      fullScreen={fullScreen}
      maxWidth="md"
    >
      <DialogTitle>
        <FlexBox alignItems="center" gap={2}>
          <IconButton href={post?.group.url} sx={{ p: 0 }}>
            {post?.group?.name && (
              <Avatar title={post.group.name} url={post.group.icon} size="m" />
            )}
          </IconButton>
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1 }}>
              {post.title}
            </Typography>
            <Typography variant="caption" sx={{ lineHeight: 1 }}>
              {post.group.name}
            </Typography>
          </Box>
          <Spacer flex={1} />
          <FlexBox gap={2}>
            {post.publicity === 'Mem' && <BadgeIcon Icon={GroupIcon} />}
            {post.pinned && <BadgeIcon Icon={PushPinIcon} />}
          </FlexBox>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </FlexBox>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {post.image && (
          <img alt="" src={post.image.toString()} style={{ width: '100%' }} />
        )}
        <Container
          dangerouslySetInnerHTML={{ __html: post.description }}
        ></Container>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', pl: 3 }}>
        <Typography variant="caption" color="text.secondary" fontStyle="italic">
          {`${t('post.modal.metadata.dates', {
            createdDuration: formatRelativeTime(post.createdAt),
            updatedDuration: formatRelativeTime(post.updatedAt),
          })}`}
        </Typography>
        {post.isAdmin && (
          <IconButton
            color="primary"
            sx={{ background: '#efefefb2' }}
            onClick={onEdit}
          >
            <EditIcon />
          </IconButton>
        )}
      </DialogActions>
    </Dialog>
  );
}
