import { useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { Button, Paper, Stack } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { getMapGroupListApi } from '#modules/group/api/getMapGroupList.api';
import { useGroupTypeDetails } from '#pages/GroupList/hooks/useGroupTypeDetails';
import { MoreActionButton } from '#pages/Map/components/MoreActionButton';
import { SelectTypeButton } from '#pages/Map/components/SelectTypeButton';
import { AutocompleteSearchField } from '#shared/components/FormFields';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';

export function SearchBar({
  showArchived,
  setShowArchived,
}: {
  showArchived: boolean;
  setShowArchived: (boolean) => void;
}) {
  const [params, setParams] = useSearchParams();
  const { t } = useTranslation();
  const { isSmaller } = useBreakpoint('sm');

  const type = useMemo(() => params.get('type'), [params]);

  const searchQuery = useMutation({
    mutationFn: (searchInput: string) =>
      getMapGroupListApi({
        search: searchInput,
        pageSize: 20,
        type: type,
        archived: showArchived,
      }),
  });

  const handleChange = useCallback(
    (val) => {
      if (val) {
        params.set('id', val.toString());
        setParams(params, { preventScrollReset: true });
      }
    },
    [params, setParams],
  );

  const groupTypeQuery = useGroupTypeDetails(type || undefined);
  return (
    <Paper sx={{ padding: 2 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', width: '100%' }}
        >
          <SelectTypeButton groupTypeQuery={groupTypeQuery} />
          {!isSmaller && (
            <Button
              component={Link}
              to={`/group?type=${type}`}
              variant="contained"
              color="secondary"
            >
              {t('map.viewList')}
            </Button>
          )}
          <Spacer flex={'auto'} />
          <MoreActionButton
            showArchive={showArchived}
            setShowArchived={setShowArchived}
            groupTypeQuery={groupTypeQuery}
          />
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', width: '100%' }}
        >
          <AutocompleteSearchField
            name="group"
            label={t('group.search.placeholder')}
            value={null}
            handleChange={handleChange}
            //size="small"
            margin="none"
            fetchOptions={(searchInput) =>
              searchQuery.mutateAsync(searchInput).then((data) => data.results)
            }
            loading={searchQuery.isPending}
            labelPropName="name"
            imagePropName="icon"
            valuePropName="id"
            disablePortal // show menu when map is fullscreen
          />
        </Stack>
      </Stack>
    </Paper>
  );
}
