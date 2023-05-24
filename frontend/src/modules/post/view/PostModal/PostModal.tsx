import React from 'react';

import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import IconButton from '@mui/material/IconButton/IconButton';

import { useTranslation } from '#shared/i18n/useTranslation';
import { FormPostProps, PostProps } from '#types/Post';

import Avatar from '../../../../shared/components/Avatar/Avatar';
import { FormPost } from '../../../../shared/components/FormPost/FormPost';
import { EditButton, PostBadges } from '../PostCard/PostCard';

export function PostModal(props: {
  post: PostProps;
  open: boolean;
  onClose: () => void;
  onUpdate?: (post: FormPostProps) => void;
  onDelete?: () => void;
}): JSX.Element {
  const { post, open, onClose, onUpdate, onDelete } = props;
  const theme = useTheme();
  const fullScreen: boolean = useMediaQuery(theme.breakpoints.down('md'));
  const [editModalOpen, setEditModalOpen] = React.useState<boolean>(false);
  const { t, formatRelativeTime } = useTranslation();
  return (
    <>
      <Dialog
        open={open && !editModalOpen}
        onClose={onClose}
        scroll="paper"
        fullWidth
        fullScreen={fullScreen}
        maxWidth="md"
        sx={{ margin: 0 }}
      >
        <DialogTitle id="scroll-dialog-title">
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{ display: 'flex', columnGap: 10, alignItems: 'center' }}
            >
              <IconButton href={post?.group.url}>
                {post?.group?.name && (
                  <Avatar
                    title={post.group.name}
                    url={post.group.icon}
                    size="medium"
                  />
                )}
              </IconButton>
              <div>
                <Typography
                  variant="h6"
                  sx={{ lineHeight: 1 }}
                  className="post-title"
                >
                  {post?.title}
                </Typography>
                <Typography variant="subtitle2" sx={{ lineHeight: 1 }}>
                  {post?.group.name}
                </Typography>
              </div>
            </div>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          {post?.image && <img alt="" src={post.image.toString()} id="image" />}
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: post?.description }}></div>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              columnGap: 10,
            }}
          >
            <PostBadges pinned={post?.pinned} publicity={post?.publicity} />
            <Typography variant="caption" textAlign="right" fontStyle="italic">
              {`${t('post.published')} ${formatRelativeTime(post?.createdAt)}`}
            </Typography>
            {post?.createdAt.toDateString() !==
              post?.updatedAt.toDateString() && (
              <>
                <Typography
                  variant="caption"
                  textAlign="right"
                  fontStyle="italic"
                >
                  •
                </Typography>
                <Typography
                  variant="caption"
                  textAlign="right"
                  fontStyle="italic"
                >
                  {`${t('post.updated')} ${formatRelativeTime(
                    post?.updatedAt
                  )}`}
                </Typography>
              </>
            )}
          </div>

          <div style={{ display: 'flex', columnGap: 10 }}>
            {post?.isAdmin && (
              <EditButton onClick={() => setEditModalOpen(true)} />
            )}
          </div>
        </DialogActions>
      </Dialog>
      <FormPost
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        post={post}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </>
  );
}

PostModal.defaultProps = {
  onUpdate: () => null,
  onDelete: () => null,
};
