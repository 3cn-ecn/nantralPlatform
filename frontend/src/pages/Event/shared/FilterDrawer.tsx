import { ReactNode, useCallback } from 'react';

import {
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  History as HistoryIcon,
  LocalFireDepartment as ShotgunIcon,
} from '@mui/icons-material';
import {
  Button,
  Checkbox,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { isSameDay } from 'date-fns';

import { EventListQueryParams } from '#modules/event/api/getEventList.api';
import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { useGroupListQuery } from '#modules/group/hooks/useGroupList.query';
import { GroupPreview } from '#modules/group/types/group.types';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import {
  AutocompleteSearchField,
  DateField,
} from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';
import { Page } from '#shared/infra/pagination';

interface FilterDrawerProps {
  filters: EventListQueryParams;
  updateFilters: (newFilter: Partial<EventListQueryParams>) => void;
  resetFilters: () => void;
  open: boolean;
  onClose: () => void;
  noDates?: boolean;
}

export function FilterDrawer({
  filters,
  updateFilters,
  resetFilters,
  open,
  onClose,
  noDates = false,
}: FilterDrawerProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const now = new Date();
  const isPastEvents =
    filters.toDate && isSameDay(filters.toDate, now) && !filters.fromDate;

  const selectedGroupsQuery = useGroupListQuery({ slug: filters.group });
  const selectedGroupsId =
    filters.group?.length && selectedGroupsQuery.isSuccess
      ? selectedGroupsQuery.data.results.map((g) => g.id)
      : [];

  // Use callbacks for every functions passed to a prop of a memoized component,
  // such as all of our Field components. This allows to optimize performance
  // (when a field is modified, we only rerender this field and not all of them).
  const fetchInitialGroupOptions = useCallback(
    () =>
      getGroupListApi({ pageSize: 7, isAdmin: true }).then(
        (data) => data.results,
      ),
    [],
  );
  const fetchGroupOptions = useCallback(
    (searchText: string) =>
      getGroupListApi({ search: searchText, pageSize: 10 }).then(
        (data) => data.results,
      ),
    [],
  );

  const handleGroupChange = useCallback(
    (val: number[], objVal: GroupPreview[]) => {
      updateFilters({ group: objVal.map((g) => g.slug) });
      queryClient.setQueryData(
        ['events', filters],
        (prevData: Page<GroupPreview>) => ({
          ...prevData,
          results: objVal,
        }),
      );
    },
    [filters, updateFilters, queryClient],
  );

  return (
    <Drawer
      keepMounted // the drawer is not reload when closed then opened
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 400, maxWidth: '90%' } }}
    >
      <Container sx={{ my: 2 }}>
        <FlexRow justifyContent="space-between" alignItems="center">
          <Typography variant="h3">{t('event.filters.title')}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </FlexRow>
        <List>
          <CheckboxListItem
            label={t('event.filters.isParticipating')}
            icon={<CheckCircleIcon />}
            value={!!filters.isParticipating}
            handleChange={(value) =>
              updateFilters({ isParticipating: value ? true : undefined })
            }
          />
          <CheckboxListItem
            label={t('event.filters.isBookmarked')}
            icon={<FavoriteIcon />}
            value={!!filters.isBookmarked}
            handleChange={(value) =>
              updateFilters({ isBookmarked: value ? true : undefined })
            }
          />
          {!noDates && (
            <CheckboxListItem
              label={t('event.filters.pastEvents')}
              icon={<HistoryIcon />}
              value={!!isPastEvents}
              handleChange={(isPastEvents) =>
                isPastEvents
                  ? updateFilters({ fromDate: null, toDate: now })
                  : updateFilters({ fromDate: null, toDate: null })
              }
            />
          )}
          <CheckboxListItem
            label={t('event.filters.isShotgun')}
            icon={<ShotgunIcon />}
            value={!!filters.isShotgun}
            handleChange={(value) =>
              updateFilters({ isShotgun: value ? true : undefined })
            }
          />
          <AutocompleteSearchField
            multiple
            label={t('event.filters.organizer')}
            value={selectedGroupsId}
            handleChange={handleGroupChange}
            loading={selectedGroupsQuery.isPending}
            defaultObjectValue={
              filters.group?.length && selectedGroupsQuery.isSuccess
                ? selectedGroupsQuery.data.results
                : []
            }
            fetchInitialOptions={fetchInitialGroupOptions}
            fetchOptions={fetchGroupOptions}
            labelPropName="name"
            imagePropName="icon"
          />
          {!noDates && (
            <>
              <DateField
                label={t('event.filters.date.fromDate')}
                fullWidth
                value={filters.fromDate || null}
                onChange={(value) =>
                  updateFilters({ fromDate: value || undefined })
                }
              />
              <DateField
                label={t('event.filters.date.toDate')}
                fullWidth
                value={filters.toDate || null}
                onChange={(value) =>
                  updateFilters({ toDate: value || undefined })
                }
              />
            </>
          )}
        </List>
        <Button
          variant="contained"
          color="secondary"
          onClick={resetFilters}
          sx={{ mt: 1 }}
        >
          {t('event.filters.reset')}
        </Button>
      </Container>
    </Drawer>
  );
}

interface CheckboxFilterProps {
  label: string;
  icon: ReactNode;
  value: boolean;
  handleChange: (value: boolean) => void;
}

function CheckboxListItem({
  label,
  icon,
  handleChange,
  value,
}: CheckboxFilterProps) {
  return (
    <ListItem disablePadding sx={{ py: 1 }}>
      <Paper
        component={ListItemButton}
        variant="outlined"
        onClick={() => handleChange(!value)}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{label}</ListItemText>
        <Checkbox checked={value} />
      </Paper>
    </ListItem>
  );
}
