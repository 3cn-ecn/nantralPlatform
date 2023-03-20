import React from 'react';
import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { PostProps } from 'Props/Post';
import { Link } from 'react-router-dom';
import { ClubProps } from '../../Props/Group';
import { theme } from '../style/palette';
import { EditButton, MembersIcon, SeePageButton } from '../PostCard/PostCard';
import { timeFromNow } from '../../utils/date';
import Avatar from '../Avatar/Avatar';
import { FormPost } from '../FormPost/FormPost';

export function PostModal(props: {
  post: PostProps;
  open: boolean;
  onClose: () => void;
  clubDetails: ClubProps;
  onUpdate?: (post: PostProps) => void;
}): JSX.Element {
  const { post, open, clubDetails, onClose, onUpdate } = props;
  const fullScreen: boolean = useMediaQuery(theme.breakpoints.down('md'));
  const [editModalOpen, setEditModalOpen] = React.useState<boolean>(false);

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
                <Link to={clubDetails.url} style={{ textDecoration: 'none' }}>
                  <Avatar
                    title={clubDetails.name}
                    url={clubDetails.icon}
                    size="medium"
                  />
                </Link>
              )}
              <div>
                <h2 id="post-title">
                  {post.publicity === 'Mem' && <MembersIcon />}
                  {post.title}
                </h2>
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
          {post.image && <img alt="" src={post.image.toString()} id="image" />}
          {/* Dangerous should change */}
          <div dangerouslySetInnerHTML={{ __html: post.description }}></div>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'space-between' }}>
          <Typography variant="caption" textAlign="right" fontStyle="italic">
            {timeFromNow(new Date(post.publicationDate))}
          </Typography>
          <div style={{ display: 'flex', columnGap: 10 }}>
            {clubDetails && clubDetails.is_admin && (
              <EditButton
                // link={`/post/${post.id}/edit`}
                onClick={() => setEditModalOpen(true)}
              />
            )}
            {post.pageSuggestion && (
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
