import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  PushPin as PushPinIcon,
} from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePostApi } from '#modules/post/api/deletePost.api';
import { Post } from '#modules/post/post.types';
import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
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
  const { staff } = useCurrentUserData();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { isLoading, mutate: deletePost } = useMutation({
    mutationFn: deletePostApi,
    onSuccess: () => {
      setIsConfirmModalOpen(false);
      queryClient.invalidateQueries(['posts']);
      onClose();
    },
  });

  return (
    <>
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={
          <IconButton component={Link} to={post.group.url} sx={{ p: 0.5 }}>
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
      <ResponsiveDialogFooter sx={{ pl: 3 }}>
        <Typography variant="caption" color="text.secondary" fontStyle="italic">
          {`${t('post.modal.metadata.dates', {
            createdDuration: formatRelativeTime(post.createdAt),
            updatedDuration: formatRelativeTime(post.updatedAt),
          })}`}
        </Typography>
        <Spacer flex={1} />
        {staff && (
          <Tooltip title={t('site.adminSettings')}>
            <IconButton
              color="secondary"
              href={`/admin/post/post/${post.id}/change/`}
              target="_blank"
            >
              <AdminPanelSettingsIcon />
            </IconButton>
          </Tooltip>
        )}
        {post.isAdmin && (
          <>
            <Tooltip title={t('post.modal.editButton.label')}>
              <IconButton color="secondary" onClick={onEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('post.modal.deleteButton.label')}>
              <IconButton
                color="secondary"
                onClick={() => setIsConfirmModalOpen(true)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            {isConfirmModalOpen && (
              <ConfirmationModal
                title={t('post.deleteModal.title')}
                body={t('post.deleteModal.body', { title: post.title })}
                onCancel={() => setIsConfirmModalOpen(false)}
                onConfirm={() => deletePost(post.id)}
                loading={isLoading}
              />
            )}
          </>
        )}
      </ResponsiveDialogFooter>
    </>
  );
}
