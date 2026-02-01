import { MouseEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Menu, MenuItem, Skeleton } from '@mui/material';

import { useGroupTypes } from '#pages/Group/hooks/useGroupTypes';
import { useGroupTypeDetails } from '#pages/GroupList/hooks/useGroupTypeDetails';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useTranslation } from '#shared/i18n/useTranslation';

const PAGE_SIZE = 1; // 0 ne permet pas d'avoir aucun résultat

export function SelectTypeButton({
  groupTypeQuery,
}: {
  groupTypeQuery: ReturnType<typeof useGroupTypeDetails>;
}) {
  const { t } = useTranslation();

  const [params, setParams] = useSearchParams();
  const type = useMemo(() => params.get('type'), [params]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { groupTypesQuery } = useGroupTypes(PAGE_SIZE, true);

  return (
    <>
      <LoadingButton
        id="type-button"
        variant="contained"
        aria-controls={open ? 'type-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        loading={groupTypeQuery.isPending}
        endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}
      >
        {type ? (
          groupTypeQuery.isPending ? (
            <Skeleton variant="text" width={100} />
          ) : (
            groupTypeQuery.data?.name
          )
        ) : (
          t('map.selectType.all')
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
        disablePortal // show menu when map is fullscreen
      >
        {groupTypesQuery.isSuccess &&
          groupTypesQuery.data.results.map((type) => (
            <MenuItem
              key={type.slug}
              onClick={() => {
                params.set('type', type.slug);
                setParams(params, { preventScrollReset: true });
                handleClose();
              }}
            >
              {type.name}
            </MenuItem>
          ))}
        <MenuItem
          onClick={() => {
            params.delete('type');
            setParams(params, { preventScrollReset: true });
            handleClose();
          }}
        >
          {t('map.selectType.all')}
        </MenuItem>
      </Menu>
    </>
  );
}
