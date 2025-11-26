import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  History,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { Menu, MenuItem, Tooltip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { getGroupHistoryApi } from '#modules/group/api/getGroupHistory.api';
import { Group } from '#modules/group/types/group.types';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useTranslation } from '#shared/i18n/useTranslation';

interface HistoryButtonProps {
  group: Group;
}

export default function HistoryButton(props: HistoryButtonProps) {
  const { group } = props;
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { data, isPending, isError } = useQuery({
    queryFn: () => getGroupHistoryApi(group.slug),
    queryKey: ['history', { slug: group.slug }],
  });
  const { formatRelativeTime } = useTranslation();

  const handleItemClick = (version: number) => {
    setSearchParams(
      { version: version.toString() },
      { preventScrollReset: true },
    );
    handleClose();
  };

  return (
    <>
      <LoadingButton
        startIcon={<History />}
        color={'secondary'}
        variant={'contained'}
        loading={isPending}
        disabled={isPending || isError}
        aria-controls={open ? 'type-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      >
        {t('group.details.history')}
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
        {data &&
          data.map((item, i) => (
            <Tooltip
              title={item.historyChangeReason}
              key={item.pk}
              placement={'right'}
            >
              <MenuItem
                onClick={() => handleItemClick(item.pk)}
                selected={
                  searchParams.has('version')
                    ? searchParams.get('version') === item.pk.toString()
                    : i === 0 // first item is active if no version is specified
                }
              >
                {item.user ?? 'Inconnu'} /{' '}
                {formatRelativeTime(item.historyDate)}
              </MenuItem>
            </Tooltip>
          ))}
      </Menu>
    </>
  );
}
