import { AdminPanelSettings as AdminPanelSettingsIcon } from '@mui/icons-material';
import { Box, IconButton, Skeleton, Tooltip, Typography } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { sortLinks } from '#modules/social_link/utils/sortLinks';
import { SocialLinkItem } from '#modules/social_link/view/shared/SocialLinkItem';
import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useAuth } from '#shared/context/Auth.context';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';

import { EditButton } from './Buttons/EditButton';
import { SubscribeButton } from './Buttons/SubscribeButton';
import { GroupInfoLine } from './GroupInfoLine';
import { TimeAndPlace } from './TimeAndPlace';

export function GroupInfo({
  group,
  isLoading,
  memberCount,
  eventCount,
}: {
  group?: Group;
  isLoading: boolean;
  memberCount?: number;
  eventCount?: number;
}) {
  const { staff } = useCurrentUserData();
  const { t } = useTranslation();
  const { isSmaller } = useBreakpoint('sm');
  const { isAuthenticated } = useAuth();

  const sortedSocialLinks = group ? sortLinks(group.socialLinks) : [];

  return (
    <FlexRow
      columnGap={4}
      rowGap={2}
      mt={3}
      mb={2}
      flexWrap={isSmaller ? 'wrap' : 'nowrap'}
    >
      <Box
        sx={{
          ...(isSmaller && group?.banner && { mt: -6 }),
          ...(isSmaller && { mx: 'auto' }),
        }}
      >
        {isLoading ? (
          <Skeleton
            variant="circular"
            animation="wave"
            width={170}
            height={170}
          />
        ) : (
          <Avatar
            src={group?.icon}
            alt={group?.shortName || 'icon'}
            size="xxl"
          />
        )}
      </Box>
      <FlexCol>
        <FlexRow gap={1} alignItems="center">
          <Typography variant="h1">
            {isLoading ? (
              <Skeleton animation="wave" width={200} />
            ) : (
              group?.name
            )}
          </Typography>
          {group && staff && (
            <Tooltip title={t('site.adminSettings')}>
              <IconButton
                size="large"
                href={`/admin/group/group/${group?.id}/change/`}
                target="_blank"
              >
                <AdminPanelSettingsIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
        </FlexRow>

        <GroupInfoLine
          isLoading={isLoading}
          eventCount={eventCount}
          memberCount={memberCount}
          slug={group?.slug}
        />

        {(group?.meetingHour || group?.meetingPlace) && (
          <TimeAndPlace time={group?.meetingHour} place={group?.meetingPlace} />
        )}

        {group?.summary && <Typography mt={2}>{group?.summary}</Typography>}

        {sortedSocialLinks.length > 0 && (
          <FlexRow flexWrap="wrap" mt={2} ml="-4px">
            {sortedSocialLinks?.map((socialLink) => (
              <SocialLinkItem key={socialLink.id} socialLink={socialLink} />
            ))}
          </FlexRow>
        )}
        <FlexRow py={2} gap={1}>
          {isAuthenticated && group && (
            <SubscribeButton
              groupSlug={group.slug}
              isSubscribed={group?.isSubscribed}
            />
          )}
          {group?.isAdmin && <EditButton group={group} />}
        </FlexRow>
      </FlexCol>
    </FlexRow>
  );
}
