import { useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { Button, Paper } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { getMapGroupListApi } from '#modules/group/api/getMapGroupList.api';
import { useGroupTypeDetails } from '#pages/GroupList/hooks/useGroupTypeDetails';
import { MoreActionButton } from '#pages/Map/components/MoreActionButton';
import { SelectTypeButton } from '#pages/Map/components/SelectTypeButton';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
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
      <FlexCol gap={2}>
        <FlexRow alignItems="center" gap={2} width={'100%'}>
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
        </FlexRow>
        <FlexRow alignItems="center" gap={2} width={'100%'}>
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
        </FlexRow>
      </FlexCol>
    </Paper>
  );
}
