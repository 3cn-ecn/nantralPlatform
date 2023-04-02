import React from 'react';
import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
} from '@mui/material';
import IconButton from '@mui/material/IconButton/IconButton';
import { PostProps } from 'Props/Post';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SimpleGroupProps } from '../../Props/Group';
import { theme } from '../style/palette';
import { EditButton, PostBadges, SeePageButton } from '../PostCard/PostCard';
import { timeFromNow } from '../../utils/date';
import Avatar from '../Avatar/Avatar';
import { FormPost } from '../FormPost/FormPost';

export function PostModal(props: {
  post: PostProps;
  open: boolean;
  onClose: () => void;
  clubDetails: SimpleGroupProps;
  onUpdate?: (post: PostProps) => void;
}): JSX.Element {
  const { post, open, clubDetails, onClose, onUpdate } = props;
  const fullScreen: boolean = useMediaQuery(theme.breakpoints.down('md'));
  const [editModalOpen, setEditModalOpen] = React.useState<boolean>(false);
  const { t } = useTranslation('translation');
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
              {clubDetails && (
                <IconButton href={clubDetails.url}>
                  <Avatar
                    title={clubDetails.name}
                    url={clubDetails.icon}
                    size="medium"
                  />
                </IconButton>
              )}
              <div>
                <h2 className="post-title">{post?.title}</h2>
                <div style={{ fontSize: 12 }}>
                  {clubDetails && clubDetails.name}
                </div>
              </div>
            </div>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          {post?.image && <img alt="" src={post.image.toString()} id="image" />}
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
              {`${t('post.published')} ${timeFromNow(post?.publicationDate)}`}
            </Typography>
            {post?.publicationDate.toDateString() !==
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
                  {`${t('post.updated')} ${timeFromNow(post?.updatedAt)}`}
                </Typography>
              </>
            )}
          </div>

          <div style={{ display: 'flex', columnGap: 10 }}>
            {post?.canEdit && (
              <EditButton onClick={() => setEditModalOpen(true)} />
            )}
            {post?.pageSuggestion && (
              <SeePageButton link={post.pageSuggestion} />
            )}
          </div>
        </DialogActions>
      </Dialog>
      <FormPost
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        post={post}
        onUpdate={onUpdate}
      />
    </>
  );
}

PostModal.defaultProps = {
  onUpdate: null,
};
