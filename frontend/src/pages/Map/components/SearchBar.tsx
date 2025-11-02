import { useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { Button, Paper } from '@mui/material';

import { getMapGroupListApi } from '#modules/group/api/getMapGroupList.api';
import { MapGroupSearch } from '#modules/group/types/group.types';
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
  const groupId = useMemo(() => {
    const id = params.get('id');
    if (id) {
      return parseInt(id);
    }
    return null;
  }, [params]);

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
          <AutocompleteSearchField<MapGroupSearch, 'name', 'icon'>
            name="group"
            label={t('group.search.placeholder')}
            value={groupId}
            handleChange={handleChange}
            //size="small"
            margin="none"
            fetchOptions={async (searchInput): Promise<MapGroupSearch[]> => {
              const res = await getMapGroupListApi({
                search: searchInput,
                pageSize: 6 * 3,
                type: type,
                archived: showArchived,
              });
              return res.results;
            }}
            labelPropName={'name'}
            imagePropName={'icon'}
            disablePortal // show menu when map is fullscreen
          />
        </FlexRow>
      </FlexCol>
    </Paper>
  );
}
