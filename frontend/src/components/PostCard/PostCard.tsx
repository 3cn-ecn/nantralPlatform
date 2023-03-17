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
import { Edit, Groups, OpenInNew } from '@mui/icons-material';
import axios from 'axios';
import { ClubProps } from 'Props/Group';
import { useTranslation } from 'react-i18next';
import { PostProps } from '../../Props/Post';
import { PostModal } from '../Modal/PostModal';
import { ClubAvatar, ClubAvatarSkeleton } from '../ClubAvatar/ClubAvatar';
import { timeFromNow } from '../../utils/date';

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
          {post.image && (
            <CardMedia
              sx={{ backgroundImage: `url(${post.image})` }}
              id="card-image"
              component="img"
              image={post.image}
            />
          )}
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
            <ClubAvatarSkeleton size={POST_AVATAR_SIZE} textPosition="right" />
          )}
          <div style={{ columnGap: 10, display: 'flex', alignItems: 'center' }}>
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
      width="100%"
      height={POST_HEIGHT + POST_AVATAR_SIZE + 30}
    />
  );
}
