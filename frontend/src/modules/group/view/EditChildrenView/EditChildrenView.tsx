import { useState } from 'react';

import { Add } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { useGroupChildren } from '#pages/GroupDetails/hooks/useGroupChildren';
import { CreateGroupModal } from '#pages/GroupList/components/CreateGroupModal';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { useTranslation } from '#shared/i18n/useTranslation';

import { GroupGrid } from '../GroupGrid/GroupGrid';

export function EditChildrenView({ group }: { group: Group }) {
  const query = useGroupChildren({ slug: group.slug });
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h2">
          {t('group.details.modal.editGroup.tabs.subgroups')} (
          {query.data?.pages[0].count})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          {t('button.add')}
        </Button>
      </Stack>
      {query.data?.pages[0].count === 0 && (
        <Typography>This group has no subgroups 🙁</Typography>
      )}
      <InfiniteList query={query}>
        <GroupGrid
          isPending={query.isPending}
          estimatedSize={6}
          groups={query.data?.pages.flatMap((page) => page.results)}
        />
      </InfiniteList>
      {open && (
        <CreateGroupModal
          groupType={group.groupType}
          onClose={() => setOpen(false)}
          parent={group}
        />
      )}
    </>
  );
}
