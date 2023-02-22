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
} from '@mui/material';
import * as React from 'react';

import './PostCard.scss';
import { ArrowForward, Close, Edit, PushPin } from '@mui/icons-material';
import axios from 'axios';
import { ClubProps } from 'Props/Club';

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
  const ref = React.useRef<any>(null);
  const [clubDetails, setClubDetails] = React.useState<ClubProps>(undefined);

  React.useEffect(() => {
    axios
      .get(`api/club/${club.slice(6)}`)
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
            {clubDetails && clubDetails.is_current_user_admin && (
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
              >
                Voir la page
              </Button>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
      {/* <Card sx={{ height: '100%' }}>
          <CardActionArea
            onClick={() => setOpen(true)}
            sx={{ display: 'flex', flexDirection: 'row' }}
          >
            <div id="image-shadow"></div>
            <div id="card-top">
              <IconButton
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                style={{
                  minWidth: 0,
                  padding: 0,
                  fontSize: '1em',
                }}
              >
                <MoreHoriz color="primary" style={{ height: 40, width: 40 }} />
              </IconButton>
              <PushPin sx={{ color: 'black' }} />
            </div>
            <CardMedia
              component="img"
              id="card-image"
              image={imageUri}
              alt="img"
            ></CardMedia>

            <CardContent>
              <Typography gutterBottom variant="h5" sx={{}}>
                {title}
              </Typography>
              <Typography gutterBottom variant="caption" sx={{}}>
                {club}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card> */}
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        fullWidth
        maxWidth="md"
        // aria-labelledby="scroll-dialog-title"
        // aria-describedby="scroll-dialog-description"
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
            {title}
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="scroll-dialog-description"
            // ref={descriptionElementRef}
            tabIndex={-1}
          >
            <img alt="" src={imageUri} id="image" />
            <div dangerouslySetInnerHTML={{ __html: description }}></div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
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
            >
              Voir la page
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {/* <Modal open={open} onClose={() => setOpen(false)}>
        <div id="container">
          <div id="image-container">
            <h2 id="banner-title">{title}</h2>
            <img alt="" src={imageUri} id="image" />
          </div>
        </div>
      </Modal> */}
    </>
  );
}
PostCard.defaultProps = {
  pinned: false,
  pageLink: null,
  description: null,
};
