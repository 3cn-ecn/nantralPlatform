import React from 'react';

import {
  Edit as EditIcon,
  Groups as GroupIcon,
  PushPin as PushPinIcon,
} from '@mui/icons-material';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material';

import { Post } from '#modules/post/post.types';
import { useTranslation } from '#shared/i18n/useTranslation';
import { FormPostProps, PostProps } from '#types/Post';

import Avatar from '../Avatar/Avatar';
import { PostModal } from '../Modal/PostModal';
import './PostCard.scss';

const POST_HEIGHT = 190;
export const POST_AVATAR_SIZE = 35;

export function EditButton(props: { onClick }) {
  const { onClick } = props;
  return (
    <IconButton
      aria-label="settings"
      color="primary"
      sx={{ background: '#efefefb2' }}
      onClick={onClick}
    >
      <EditIcon />
    </IconButton>
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
        <GroupIcon
          sx={{
            padding: 0.4,
            color: 'white',
            borderRadius: '50%',
            backgroundColor: 'primary.main',
          }}
        />
      )}
      {pinned && (
        <PushPinIcon
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

type PostCardProps = {
  post: Post;
  onUpdate?: (newPost: FormPostProps) => void;
  onDelete?: () => void;
};

export function PostCard({
  post,
  onUpdate = () => null,
  onDelete = () => null,
}: PostCardProps) {
  const [openModal, setOpenModal] = React.useState(false);
  const { t, formatRelativeTime } = useTranslation();

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          height: POST_HEIGHT,
        }}
      >
        <CardActionArea
          onClick={() => setOpenModal(true)}
          sx={{ display: 'flex', height: '100%' }}
        >
          <PostBadges
            pinned={post.pinned}
            publicity={post.publicity}
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
              <Typography
                variant="h6"
                sx={{ lineHeight: 1 }}
                className="post-title"
              >
                {post.title}
              </Typography>
              <div style={{ fontStyle: 'italic', marginBottom: 5 }}>
                {post.createdAt.toDateString() === post.updatedAt.toDateString()
                  ? formatRelativeTime(post.createdAt)
                  : `${t('post.updated')} ${formatRelativeTime(
                      post.updatedAt
                    )}`}
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
          {post.image && (
            <CardMedia
              sx={{ backgroundImage: `url(${post.image})` }}
              id="card-image"
              component="img"
              image={post.image.toString()}
            />
          )}
        </CardActionArea>
      </Card>
      <PostModal
        post={post}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </>
  );
}

export function PostCardSkeleton() {
  return <Skeleton variant="rounded" width="100%" height={POST_HEIGHT} />;
}
