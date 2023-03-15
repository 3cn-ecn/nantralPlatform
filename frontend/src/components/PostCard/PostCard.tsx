import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Skeleton,
  Tooltip,
} from '@mui/material';
import * as React from 'react';

import './PostCard.scss';
import {
  ArrowForward,
  Edit,
  ExitToApp,
  Groups,
  OpenInNew,
} from '@mui/icons-material';
import axios from 'axios';
import { ClubProps } from 'Props/Club';
import { useTranslation } from 'react-i18next';
import { PostProps } from '../../Props/Post';
import { PostModal } from '../Modal/PostModal';
import ClubAvatar from '../ClubAvatar/ClubAvatar';

const POST_HEIGHT = 150;
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

export function EditButton() {
  return (
    <IconButton
      aria-label="settings"
      color="primary"
      sx={{ background: '#efefefb2' }}
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

export function timeFromNow(date: Date): string {
  const seconds: number = (new Date().getTime() - date.getTime()) / 1000;
  if (seconds < 60) return `${Math.round(seconds).toString()} seconds`;
  const minutes: number = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes).toString()} minutes`;
  const hours: number = minutes / 60;
  if (hours < 60) return `${Math.round(hours).toString()} hours`;
  const days: number = hours / 24;
  if (days < 30) return `${Math.round(days).toString()} days`;
  const months: number = days / 30;
  if (months < 12) return `${Math.round(months).toString()} months`;
  const years: number = months / 12;
  return `${Math.round(years).toString()} years`;
}
SeePageButton.defaultProps = {
  style: null,
};
export function PostCard(props: { post: PostProps }) {
  const { post } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const [clubDetails, setClubDetails] = React.useState<ClubProps>(undefined);

  React.useEffect(() => {
    axios
      .get(`/api/group/group/${post.groupSlug}/`)
      .then((res) => setClubDetails(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          // height: POST_HEIGHT,
          borderColor: post.pinned ? 'primary.main' : '',
          borderWidth: 1,
          height: '100%',
          // display: 'flex',
        }}
      >
        <CardActionArea
          onClick={() => setOpen(true)}
          sx={{ display: 'flex', height: POST_HEIGHT }}
        >
          {post.image && (
            <CardMedia
              sx={{ backgroundImage: `url(${post.image})` }}
              id="card-image"
              component="img"
              image={post.image}
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
            <h2
              id="post-title"
              style={{
                wordBreak: 'break-word',
                maxLines: 5,
                display: '-webkit-flex',
                WebkitLineClamp: 2,
              }}
            >
              {post.publicity === 'Mem' && <MembersIcon />}
              {post.title}
            </h2>
            <p id="post-club">
              {`${timeFromNow(new Date(post.publicationDate))} ago`}
            </p>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ justifyContent: 'space-between' }}>
          {clubDetails ? (
            <ClubAvatar
              size={POST_AVATAR_SIZE}
              textPosition="right"
              clubUrl={clubDetails.url}
              name={clubDetails.name}
              logoUrl={clubDetails.icon}
            />
          ) : (
            <Skeleton
              variant="circular"
              sx={{ width: POST_AVATAR_SIZE, height: POST_AVATAR_SIZE }}
            />
          )}
          <div style={{ columnGap: 10, display: 'flex' }}>
            {clubDetails && clubDetails.is_admin && <EditButton />}
            {post.pageSuggestion && (
              <SeePageButton link={post.pageSuggestion} />
            )}
          </div>
        </CardActions>
      </Card>
      <PostModal
        post={post}
        clubDetails={clubDetails}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export function PostCardSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      sx={{
        height: POST_HEIGHT + 55,
      }}
    ></Skeleton>
  );
}
