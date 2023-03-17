import React from 'react';
import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { PostProps } from 'Props/Post';
import { ClubProps } from '../../Props/Group';
import { theme } from '../style/palette';
import { ClubAvatar } from '../ClubAvatar/ClubAvatar';
import {
  EditButton,
  MembersIcon,
  POST_AVATAR_SIZE,
  SeePageButton,
} from '../PostCard/PostCard';
import { timeFromNow } from '../../utils/date';

export function PostModal(props: {
  post: PostProps;
  open: boolean;
  onClose: () => void;
  clubDetails: ClubProps;
}): JSX.Element {
  const { post, open, clubDetails, onClose } = props;
  const fullScreen: boolean = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={open}
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
          <h2 id="post-title">
            {post.publicity === 'Mem' && <MembersIcon />}
            {post.title}
          </h2>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
          {post.image && <img alt="" src={post.image} id="image" />}
          {/* Dangerous should change */}
          <div dangerouslySetInnerHTML={{ __html: post.description }}></div>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'right',
            }}
          >
            <Typography variant="caption" textAlign="right">
              {timeFromNow(new Date(post.publicationDate))}
            </Typography>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'space-between' }}>
        {clubDetails && (
          <ClubAvatar
            name={clubDetails.name}
            clubUrl={clubDetails.url}
            logoUrl={clubDetails.icon}
            textPosition="right"
            size={POST_AVATAR_SIZE}
          />
        )}
        <div style={{ display: 'flex', columnGap: 10 }}>
          {clubDetails && clubDetails.is_admin && <EditButton />}
          {post.pageSuggestion && <SeePageButton link={post.pageSuggestion} />}
        </div>
      </DialogActions>
    </Dialog>
  );
}
