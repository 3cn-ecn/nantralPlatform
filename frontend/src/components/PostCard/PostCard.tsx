import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Skeleton,
  Tooltip,
} from '@mui/material';
import * as React from 'react';

import './PostCard.scss';
import { Edit, Groups, OpenInNew, PushPin } from '@mui/icons-material';
import axios from 'axios';
import { ClubProps } from 'Props/Group';
import { useTranslation } from 'react-i18next';
import { PostProps } from '../../Props/Post';
import { PostModal } from '../Modal/PostModal';
import { timeFromNow } from '../../utils/date';
import Avatar from '../Avatar/Avatar';

const POST_HEIGHT = 180;
export const POST_AVATAR_SIZE = 35;
export function SeePageButton(props: {
  link: string;
  style?: React.CSSProperties;
}) {
  const { link, style } = props;
  return (
    <IconButton
      style={style}
      onClick={(e) => e.stopPropagation()}
      target="_blank"
      href={link}
      sx={{ backgroundColor: '#efefefb2' }}
    >
      <OpenInNew color="primary" />
    </IconButton>
  );
}

export function EditButton(props: { onClick }) {
  const { onClick } = props;
  return (
    <IconButton
      aria-label="settings"
      color="primary"
      sx={{ background: '#efefefb2' }}
      onClick={onClick}
    >
      <Edit />
    </IconButton>
  );
}

export function MembersIcon() {
  const { t } = useTranslation('translation');
  return (
    <Tooltip title={t('event.membersOnly')} arrow>
      <Groups sx={{ marginRight: 1 }} />
    </Tooltip>
  );
}
SeePageButton.defaultProps = {
  style: null,
};
export function PostCard(props: { post: PostProps }) {
  const { post } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const [clubDetails, setClubDetails] = React.useState<ClubProps>(undefined);
  const [postValue, setPostValue] = React.useState(post);
  const { t } = useTranslation('translation');

  React.useEffect(() => {
    setPostValue(post);
  }, [post]);

  React.useEffect(() => {
    axios
      .get(`/api/group/group/${postValue.groupSlug}/`)
      .then((res) => setClubDetails(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          height: POST_HEIGHT,
        }}
      >
        <CardActionArea
          onClick={() => setOpen(true)}
          sx={{ display: 'flex', height: '100%' }}
        >
          <div className="post-icons">
            {postValue.publicity === 'Mem' && (
              <Groups
                sx={{
                  padding: 0.4,
                  color: 'white',
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                }}
              />
            )}
            {post.pinned && (
              <PushPin
                sx={{
                  padding: 0.4,
                  color: 'white',
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                }}
              />
            )}
          </div>
          <CardContent
            style={{
              borderColor: 'red',
              borderWidth: '10px',
              flexDirection: 'column',
              display: 'flex',
              width: '100%',
              height: '100%',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <h2 className="post-title">{postValue.title}</h2>
              <div style={{ fontStyle: 'italic', marginBottom: 5 }}>
                {postValue.publicationDate.toDateString() ===
                postValue.updatedAt.toDateString()
                  ? timeFromNow(postValue.publicationDate)
                  : `${t('post.updated')} ${timeFromNow(postValue.updatedAt)}`}
              </div>
            </div>
            <div id="post-club">
              {clubDetails ? (
                <div style={{ display: 'contents' }}>
                  <Avatar
                    title={clubDetails.name}
                    url={clubDetails.icon}
                    size="small"
                  />
                  {clubDetails.name}
                </div>
              ) : (
                <div style={{ display: 'contents' }}>
                  <Skeleton variant="circular">
                    <Avatar title="" size="small" />
                  </Skeleton>
                  <Skeleton variant="text" width="5em" height="2em"></Skeleton>
                </div>
              )}
            </div>
          </CardContent>
          {postValue.image && (
            <CardMedia
              sx={{ backgroundImage: `url(${postValue.image})` }}
              id="card-image"
              component="img"
              image={postValue.image.toString()}
            />
          )}
        </CardActionArea>
      </Card>
      <PostModal
        post={postValue}
        clubDetails={clubDetails}
        open={open}
        onClose={() => setOpen(false)}
        onUpdate={setPostValue}
      />
    </>
  );
}

export function PostCardSkeleton() {
  return <Skeleton variant="rectangular" width="100%" height={POST_HEIGHT} />;
}
