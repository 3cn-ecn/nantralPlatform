import { MouseEvent, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from '@mui/icons-material';
import {
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
} from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { useGroupTypes } from '#pages/Group/hooks/useGroupTypes';
import { useGroupTypeDetails } from '#pages/GroupList/hooks/useGroupTypeDetails';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { SearchField } from '#shared/components/FormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';

const PAGE_SIZE = 20;

export default function MapPage() {
  const { t } = useTranslation();
  const { isSmaller } = useBreakpoint('sm');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const open2 = Boolean(anchorEl2);
  const handleClick2 = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const [params, setParams] = useSearchParams();
  const search = useMemo(() => params.get('search'), [params]);
  const type = useMemo(() => params.get('type'), [params]);

  const groupTypeQuery = useGroupTypeDetails(type || undefined);

  const groupSearchQuery = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      getGroupListApi({
        search: search,
        pageSize: 6 * 3,
        page: pageParam,
        type: type,
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    queryKey: ['groups', { search, type: type }],
    enabled: !!search,
  });

  const { listQueries, groupTypesQuery } = useGroupTypes(PAGE_SIZE, true);

  return (
    <Container sx={{ my: 3 }}>
      <FlexRow alignItems="center" gap={2} mb={4}>
        <Typography variant="h1">{t('map.title')}</Typography>
        <LoadingButton
          id="type-button"
          variant="contained"
          aria-controls={open ? 'type-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          loading={groupTypeQuery.isLoading}
          endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        >
          {type ? (
            groupTypeQuery.isLoading ? (
              <Skeleton variant="text" width={100} />
            ) : (
              groupTypeQuery.data?.name
            )
          ) : (
            t('map.selectType')
          )}
        </LoadingButton>
        <Menu
          id="type-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'type-button',
          }}
        >
          {groupTypesQuery.isSuccess &&
            groupTypesQuery.data.results.map((type) => (
              <MenuItem
                key={type.slug}
                onClick={() => {
                  params.set('type', type.slug);
                  setParams(params);
                  handleClose();
                }}
              >
                {type.name}
              </MenuItem>
            ))}
        </Menu>
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
        <SearchField
          value={search}
          handleChange={(val) => {
            if (val) {
              params.set('search', val);
              setParams(params, { preventScrollReset: true });
            } else {
              params.delete('search');
              setParams(params, { preventScrollReset: true });
            }
          }}
          size="small"
          placeholder={t('group.search.placeholder')}
          sx={{ my: 0 }}
        />
        <IconButton
          aria-label="more"
          id="more-button"
          aria-controls={open2 ? 'more-menu' : undefined}
          aria-expanded={open2 ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick2}
        >
          <MoreHoriz />
        </IconButton>
        <Menu
          id="more-menu"
          anchorEl={anchorEl2}
          open={open2}
          onClose={handleClose2}
          MenuListProps={{
            'aria-labelledby': 'more-button',
          }}
        >
          {isSmaller && (
            <MenuItem
              component={Link}
              to={`/group?type=${type}`}
              onClick={handleClose2}
            >
              {t('map.viewList')}
            </MenuItem>
          )}
          <MenuItem onClick={handleClose2}>
            {t('map.moreButton.viewArchive')}
          </MenuItem>
          <MenuItem onClick={handleClose2}>
            {t('map.moreButton.addGroup')}
          </MenuItem>
        </Menu>
      </FlexRow>
      <Spacer vertical={2} />
    </Container>
  );
}
