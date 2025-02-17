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

import { usePostQueryParamState } from '#modules/post/hooks/usePostQueryParamState';
import { PostPreview } from '#modules/post/post.types';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { BadgeIcon } from '../shared/BadgeIcon';

interface PostCardProps {
  post: PostPreview;
}

export function PostCard({ post }: PostCardProps) {
  const { formatRelativeTime } = useTranslation();
  const { setPostId } = usePostQueryParamState();

  const openModal = () => setPostId(post.id);

  return (
    <>
      <StyledCard>
        <StyledCardActionArea onClick={openModal}>
          <BadgeIconsContainer>
            {post.publicity === 'Mem' && <BadgeIcon Icon={GroupIcon} />}
            {post.pinned && <BadgeIcon Icon={PushPinIcon} />}
          </BadgeIconsContainer>
          <CardContent>
            <Box mt={1}>
              <Typography variant="h6" lineHeight={1.2} mb={1}>
                {post.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontStyle="italic"
              >
                {upperFirst(formatRelativeTime(post.createdAt))}
              </Typography>
            </Box>
            <Spacer vertical={1} flex={1} />
            <FlexRow alignItems="center" gap={1}>
              <Avatar
                alt={post.group.shortName}
                src={post.group.icon}
                size="s"
              />
              <Typography variant="caption">{post.group.name}</Typography>
            </FlexRow>
          </CardContent>
          {post.image && (
            <CardMedia
              component="img"
              src={post.image}
              loading="lazy"
              alt=""
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

const CardContent = styled(FlexCol)({
  padding: 16,
  flex: 1,
  height: '100%',
});

const BadgeIconsContainer = styled(FlexRow)({
  position: 'absolute',
  gap: 8,
  top: 12,
  right: 12,
});
