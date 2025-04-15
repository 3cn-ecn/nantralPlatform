import { useCallback, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { Button, Container, Typography } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';

import { getMapGroupListApi } from '#modules/group/api/getMapGroupList.api';
import { MapGroupPreview } from '#modules/group/types/group.types';
import { MoreActionButton } from '#pages/Map/components/MoreActionButton';
import { SelectTypeButton } from '#pages/Map/components/SelectTypeButton';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { AutocompleteSearchField } from '#shared/components/FormFields';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';

import { CustomMap } from './components/CustomMap';

export default function MapPage() {
  const { t } = useTranslation();
  const { isSmaller } = useBreakpoint('sm');
  const [showArchive, setShowArchive] = useState(false);

  const [params, setParams] = useSearchParams();
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

  return (
    <Container sx={{ my: 3 }}>
      <FlexRow alignItems="center" gap={2} mb={4}>
        <Typography variant="h1">{t('map.title')}</Typography>
        <SelectTypeButton />
        {!isSmaller && (
          <>
            <Spacer flex="auto" />
            <Button
              component={Link}
              to={`/group?type=${type}`}
              variant="contained"
              color="secondary"
            >
              {t('map.viewList')}
            </Button>
          </>
        )}
      </FlexRow>
      <FlexRow alignItems="center" gap={2} mb={4}>
        <AutocompleteSearchField<MapGroupPreview, 'name', 'icon'>
          name="group"
          label={t('group.search.placeholder')}
          value={groupId}
          handleChange={handleChange}
          size="small"
          sx={{ my: 0 }}
          fetchOptions={async (searchInput): Promise<MapGroupPreview[]> => {
            const res = await getMapGroupListApi({
              search: searchInput,
              pageSize: 6 * 3,
              type: type,
              archived: showArchive,
            });
            return res.results;
          }}
          labelPropName={'name'}
          imagePropName={'icon'}
        />
        <MoreActionButton
          showArchive={showArchive}
          setShowArchive={setShowArchive}
        />
      </FlexRow>
      <Spacer vertical={2} />
      <CustomMap groupType={type || undefined} showArchived={showArchive} />
      <Spacer vertical={2} />
    </Container>
  );
}
