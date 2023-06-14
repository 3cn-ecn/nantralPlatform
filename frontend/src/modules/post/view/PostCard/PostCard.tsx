import React, { useState } from 'react';

import {
  Groups as GroupIcon,
  PushPin as PushPinIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  styled,
} from '@mui/material';
import { upperFirst } from 'lodash-es';

import { PostPreview } from '#modules/post/post.types';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexBox } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { PostModal } from '../PostModal/PostModal';
import { BadgeIcon } from '../shared/BadgeIcon';

type PostCardProps = {
  post: PostPreview;
};

export function PostCard({ post }: PostCardProps) {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const { formatRelativeTime } = useTranslation();

  return (
    <>
      <StyledCard variant="outlined">
        <StyledCardActionArea onClick={() => setOpenModal(true)}>
          <BadgeIconsContainer>
            {post.publicity === 'Mem' && <BadgeIcon Icon={GroupIcon} />}
            {post.pinned && <BadgeIcon Icon={PushPinIcon} />}
          </BadgeIconsContainer>
          <CardContent>
            <Box mt={1}>
              <Typography variant="h6" lineHeight={1.2}>
                {post.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontStyle="italic"
              >
                {upperFirst(formatRelativeTime(post.updatedAt))}
              </Typography>
            </Box>
            <Spacer vertical={8} flex={1} />
            <FlexBox alignItems="center" gap={1}>
              <Avatar title={post.group.name} url={post.group.icon} size="s" />
              <Typography variant="caption">{post.group.name}</Typography>
            </FlexBox>
          </CardContent>
          {post.image && (
            <CardMedia
              component="img"
              image={post.image.toString()}
              sx={{
                width: 100,
                aspectRatio: '1',
                margin: 2,
                marginLeft: 0,
                borderRadius: 1,
                backgroundSize: 'cover',
              }}
            />
          )}
        </StyledCardActionArea>
      </StyledCard>
      {openModal && (
        <PostModal
          postId={post.id}
          onClose={() => setOpenModal(false)}
          onEdit={() => {
            setOpenModal(false);
            setOpenEditModal(true);
          }}
        />
      )}
      {/* <FormPost
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        post={post}
        onUpdate={onUpdate}
        onDelete={onDelete}
      /> */}
    </>
  );
}

const StyledCard = styled(Card)({
  height: '100%',
});

const StyledCardActionArea = styled(CardActionArea)({
  display: 'flex',
  height: '100%',
});

const CardContent = styled(FlexBox)({
  padding: 16,
  flex: 1,
  flexDirection: 'column',
  height: '100%',
});

const BadgeIconsContainer = styled(FlexBox)({
  position: 'absolute',
  gap: 8,
  top: 12,
  right: 12,
});
