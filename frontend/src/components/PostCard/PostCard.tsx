import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import * as React from 'react';

import './PostCard.scss';
import { ArrowForward, Close, Edit, PushPin } from '@mui/icons-material';
import axios from 'axios';
import { ClubProps } from 'Props/Club';
import ClubAvatar from '../ClubAvatar/ClubAvatar';
import { theme } from '../style/palette';
import { PostProps } from '../../Props/Post';
import { formatDate } from '../../utils/date';

export function PostCard(props: { post: PostProps }) {
  const { post } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const [clubDetails, setClubDetails] = React.useState<ClubProps>(undefined);
  const fullScreen: boolean = useMediaQuery(theme.breakpoints.down('md'));
  React.useEffect(() => {
    axios
      .get(`api/group/group/${post.group_slug}`)
      .then((res) => setClubDetails(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleClick = (event) => {
    event.stopPropagation();
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Card
        variant={post.pinned ? 'outlined' : 'elevation'}
        sx={{
          height: '110px',
          borderColor: 'red',
          borderWidth: 1,
        }}
      >
        <CardActionArea
          id="post-container"
          onClick={() => setOpen(true)}
          disableTouchRipple
        >
          {post.image && (
            <CardMedia src={post.image} id="card-image" component="img" />
          )}
          {/* I don't like the pin icon */}
          {post.pinned && false && (
            <PushPin
              sx={{
                position: 'absolute',
                color: 'primary.main',
                height: '30px',
                width: '30px',
              }}
            />
          )}
          <CardContent
            style={{
              borderColor: 'red',
              borderWidth: '10px',
              flexDirection: 'column',
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-start',
            }}
          >
            <div>
              <h2 id="post-title">{post.title}</h2>
              <p id="post-club">{clubDetails && clubDetails.name}</p>
            </div>
            {clubDetails && clubDetails.is_admin && (
              <IconButton
                onClick={handleClick}
                aria-label="settings"
                style={{ position: 'absolute', right: 0, top: 0 }}
              >
                <Edit />
              </IconButton>
            )}
            {post.page_suggestion && (
              <Button
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  marginRight: 10,
                  marginBottom: 5,
                }}
                onClick={(e) => e.stopPropagation()}
                endIcon={<ArrowForward />}
                href={post.page_suggestion}
              >
                Voir la page
              </Button>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
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
            <div>{post.title}</div>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <img alt="" src={post.image} id="image" />
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
                  new Date(post.publication_date),
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
          {post.page_suggestion && (
            <Button
              style={{
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
              endIcon={<ArrowForward />}
              href={post.page_suggestion}
            >
              Voir la page
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
