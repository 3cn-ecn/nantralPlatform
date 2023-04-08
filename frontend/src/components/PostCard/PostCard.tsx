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
import { ClubProps, SimpleGroupProps } from 'Props/Group';
import { useTranslation } from 'react-i18next';
import { FormPostProps, PostProps } from '../../Props/Post';
import { PostModal } from '../Modal/PostModal';
import { timeFromNow } from '../../utils/date';
import Avatar from '../Avatar/Avatar';

const POST_HEIGHT = 190;
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

export function PostBadges(props: {
  pinned: boolean;
  className?: string;
  style?: any;
  publicity: PostProps['publicity'];
}) {
  const { pinned, publicity, className, style } = props;
  return (
    <div
      className={className}
      style={{ display: 'flex', columnGap: '0.6em', ...style }}
    >
      {publicity === 'Mem' && (
        <Groups
          sx={{
            padding: 0.4,
            color: 'white',
            borderRadius: '50%',
            backgroundColor: 'primary.main',
          }}
        />
      )}
      {pinned && (
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
  );
}
PostBadges.defaultProps = {
  className: null,
  style: {},
};

SeePageButton.defaultProps = {
  style: null,
};
export function PostCard(props: { post: PostProps; onDelete?: () => void }) {
  const { post, onDelete } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const [postValue, setPostValue] = React.useState(post);
  const { t } = useTranslation('translation');

  React.useEffect(() => {
    setPostValue(post);
  }, [post]);

  const updatePost = (newPost: FormPostProps) => {
    if (newPost) {
      Object.entries(newPost).forEach(([key, value]) => {
        post[key] = value;
      });
      setPostValue(post);
    } else {
      onDelete();
      setOpen(false);
    }
  };

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
          <PostBadges
            pinned={postValue.pinned}
            publicity={postValue.publicity}
            className="post-icons"
          />
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
              <div style={{ display: 'contents' }}>
                <Avatar
                  title={post?.group.name}
                  url={post?.group.icon}
                  size="small"
                />
                {post.group.name}
              </div>
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
        open={open}
        onClose={() => setOpen(false)}
        onUpdate={updatePost}
      />
    </>
  );
}

PostCard.defaultProps = {
  onDelete: () => null,
};

export function PostCardSkeleton() {
  return <Skeleton variant="rectangular" width="100%" height={POST_HEIGHT} />;
}
