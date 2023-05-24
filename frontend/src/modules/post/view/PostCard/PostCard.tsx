import React from 'react';

import {
  Edit as EditIcon,
  Groups as GroupIcon,
  PushPin as PushPinIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Skeleton,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';

import { Post } from '#modules/post/post.types';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { useTranslation } from '#shared/i18n/useTranslation';
import { FormPostProps } from '#types/Post';

import { PostModal } from '../PostModal/PostModal';
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

type PostBadgesProps = {
  pinned: boolean;
  publicity: Post['publicity'];
  sx?: SxProps<Theme>;
};

export function PostBadges({ pinned, publicity, sx = {} }: PostBadgesProps) {
  const sxIconProp: SxProps<Theme> = {
    padding: 0.4,
    color: 'white',
    borderRadius: '50%',
    backgroundColor: 'primary.main',
  };

  return (
    <Box display="flex" gap={1} sx={sx}>
      {publicity === 'Mem' && <GroupIcon sx={sxIconProp} />}
      {pinned && <PushPinIcon sx={sxIconProp} />}
    </Box>
  );
}

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
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardActionArea
          onClick={() => setOpenModal(true)}
          sx={{ display: 'flex', height: '100%' }}
        >
          <PostBadges
            pinned={post.pinned}
            publicity={post.publicity}
            sx={{ position: 'absolute', top: '1rem', right: '1rem' }}
          />
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: 2,
              height: '100%',
            }}
          >
            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Typography variant="h6" lineHeight={1}>
                {post.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontStyle="italic"
              >
                {t('post.updated', {
                  dateRange: formatRelativeTime(post.updatedAt),
                })}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar
                title={post?.group.name}
                url={post?.group.icon}
                size="s"
              />
              <Typography variant="caption">{post.group.name}</Typography>
            </Box>
          </CardContent>
          {post.image && (
            <CardMedia
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
