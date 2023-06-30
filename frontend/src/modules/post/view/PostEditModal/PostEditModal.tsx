import { Edit as EditIcon } from '@mui/icons-material';
import { Avatar, useTheme } from '@mui/material';

import {
  ResponsiveDialog,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { useTranslation } from '#shared/i18n/useTranslation';

import { usePostDetailsQuery } from '../hooks/usePostDetails.query';
import { PostEditModalContent } from './PostEditModalContent';

type PostEditModalProps = {
  postId: number;
  onClose: () => void;
};

export function PostEditModal({ postId, onClose }: PostEditModalProps) {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const { post, ...postQuery } = usePostDetailsQuery(postId);

  return (
    <ResponsiveDialog onClose={onClose}>
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={
          <Avatar sx={{ bgcolor: palette.primary.main }}>
            <EditIcon />
          </Avatar>
        }
      >
        {t('post.editModal.title')}
      </ResponsiveDialogHeader>
      {post && <PostEditModalContent post={post} onClose={onClose} />}
    </ResponsiveDialog>
  );
}
