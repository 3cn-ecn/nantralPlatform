import { AdminPanelSettings } from '@mui/icons-material';
import { Button, Skeleton, Typography } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { sortLinks } from '#modules/social_link/utils/sortLinks';
import { SocialLinkItem } from '#modules/social_link/view/shared/SocialLinkItem';
import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

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

  const sortedSocialLinks = group ? sortLinks(group.socialLinks) : [];

  return (
    <FlexRow
      width="100%"
      gap={2}
      margin={2}
      alignItems={'center'}
      justifyContent={'space-between'}
      flexWrap={'wrap'}
    >
      <FlexRow gap={2} flexWrap={'wrap'} width={'100%'}>
        {isLoading ? (
          <Skeleton
            variant="circular"
            animation="wave"
            width={170}
            height={170}
          />
        ) : (
          <Avatar
            sx={{ my: 1 }}
            src={group?.icon}
            alt={group?.shortName || 'icon'}
            size="xxl"
          />
        )}
        <FlexCol alignItems={'flex-start'}>
          <Typography variant="h1">
            {isLoading ? (
              <Skeleton animation="wave" width={200} />
            ) : (
              group?.name
            )}
          </Typography>

          <GroupInfoLine
            isLoading={isLoading}
            eventCount={eventCount}
            memberCount={memberCount}
            slug={group?.slug}
          />
          <TimeAndPlace time={group?.meetingHour} place={group?.meetingPlace} />
          <Typography mt={1}>{group?.summary}</Typography>
          <FlexRow flexWrap="wrap" mt={2}>
            {sortedSocialLinks?.map((socialLink) => (
              <SocialLinkItem key={socialLink.id} socialLink={socialLink} />
            ))}
          </FlexRow>
        </FlexCol>
        {group && staff && (
          <FlexCol
            alignItems={'flex-end'}
            justifyContent={'center'}
            px={3}
            flex={1}
          >
            <Button
              variant="contained"
              startIcon={<AdminPanelSettings />}
              color="secondary"
              href={`/admin/group/group/${group.id}/change/`}
            >
              {t('group.details.modal.editGroup.title')}
            </Button>
          </FlexCol>
        )}
      </FlexRow>
    </FlexRow>
  );
}
