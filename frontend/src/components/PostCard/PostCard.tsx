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
  useMediaQuery,
} from '@mui/material';
import * as React from 'react';

import './PostCard.scss';
import { ArrowForward, Close, Edit, PushPin } from '@mui/icons-material';
import axios from 'axios';
import { ClubProps } from 'Props/Club';
import ClubAvatar from '../ClubAvatar/ClubAvatar';
import { theme } from '../style/palette';

export function PostCard(props: {
  imageUri: string;
  title: string;
  club: string;
  pinned?: boolean;
  pageLink?: string;
  description?: string;
}) {
  const { imageUri, title, club, pinned, pageLink, description } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const [clubDetails, setClubDetails] = React.useState<ClubProps>(undefined);
  const fullScreen: boolean = useMediaQuery(theme.breakpoints.down('md'));
  React.useEffect(() => {
    axios
      .get(`api/group/group/${club}`)
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
        variant={pinned ? 'outlined' : 'elevation'}
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
          {imageUri && (
            <CardMedia src={imageUri} id="card-image" component="img" />
          )}
          {pinned && (
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
              <h2 id="post-title">{title}</h2>
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
            {pageLink && (
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
                href={pageLink}
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
            <div>{title}</div>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <img alt="" src={imageUri} id="image" />
            {/* Dangerous should change */}
            <div dangerouslySetInnerHTML={{ __html: description }}></div>
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
          {pageLink && (
            <Button
              style={{
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
              endIcon={<ArrowForward />}
              href={pageLink}
            >
              Voir la page
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
PostCard.defaultProps = {
  pinned: false,
  pageLink: null,
  description: null,
};
