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
import { formatDate } from '../../utils/date';
import { ClubProps } from '../../Props/Club';
import { theme } from '../style/palette';
import ClubAvatar from '../ClubAvatar/ClubAvatar';
import { MembersIcon, SeePageButton } from '../PostCard/PostCard';

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
              {`Ajouté le ${formatDate(
                post.publicationDate,
                'short',
                'short'
              )}`}
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
            size={60}
          />
        )}
        {post.pageSuggestion && <SeePageButton link={post.pageSuggestion} />}
      </DialogActions>
    </Dialog>
  );
}
