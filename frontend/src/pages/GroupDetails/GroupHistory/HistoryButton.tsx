import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  History,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { Menu, MenuItem, Typography, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { getGroupHistoryListApi } from '#modules/group/api/getGroupHistoryList.api';
import { Group } from '#modules/group/types/group.types';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';
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
  const theme = useTheme();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { data, isLoading, isError } = useQuery({
    queryFn: () => getGroupHistoryListApi(group.slug),
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
        loading={isLoading}
        disabled={isLoading || isError}
        aria-controls={open ? 'type-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      >
        {t('group.details.history.index')}
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
        <MenuItem
          onClick={() => {
            searchParams.delete('version');
            setSearchParams(searchParams, { preventScrollReset: true });
            handleClose();
          }}
          selected={!searchParams.has('version')}
        >
          {t('group.details.history.currentVersion')}
        </MenuItem>
        {data?.results.map((item) => (
          <MenuItem
            onClick={() => handleItemClick(item.pk)}
            selected={searchParams.get('version') === item.pk.toString()}
            key={item.pk}
          >
            <FlexCol>
              {item.historyUser
                ? t('group.details.historyTimeAndUser', {
                    user: item.historyUser.name,
                    time: formatRelativeTime(item.historyDate),
                  })
                : formatRelativeTime(item.historyDate)}
              {item.historyChangeReason && (
                <Typography
                  variant={'caption'}
                  color={theme.palette.text.secondary}
                >
                  {item.historyChangeReason}
                </Typography>
              )}
            </FlexCol>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
