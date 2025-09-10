import { useEffect, useState } from 'react';

import { Close } from '@mui/icons-material';
import {
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Typography,
} from '@mui/material';

import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { DateField, SelectField } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';

import { StudentListQueryParams } from '../hooks/useFilters';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: StudentListQueryParams;
  updateFilters: (val: Partial<StudentListQueryParams>) => void;
  resetFilters: () => void;
}
export function FilterDrawer({
  open,
  onClose,
  filters,
  resetFilters,
  updateFilters,
}: FilterDrawerProps) {
  const { t } = useTranslation();
  const [tempFilters, setTempFilters] =
    useState<StudentListQueryParams>(filters);

  function updateTempFilters(val: Partial<StudentListQueryParams>) {
    setTempFilters({ ...tempFilters, ...val });
  }

  function handleReset() {
    resetFilters();
  }

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  return (
    <Drawer open={open} onClose={onClose} anchor="right">
      <Container sx={{ my: 2 }}>
        <FlexRow justifyContent="space-between" alignItems="center">
          <Typography variant="h3">{t('student.filters.title')}</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </FlexRow>
        <List>
          <ListItem>
            <SelectField
              label={t('login.formationFollowed.label')}
              value={tempFilters.faculty}
              handleChange={(val) => updateTempFilters({ faculty: val })}
            >
              <MenuItem value={undefined}>-</MenuItem>
              <MenuItem value={'Gen'}>
                {t('login.formationFollowed.generalEngineer')}
              </MenuItem>
              <MenuItem value={'Iti'}>
                {t('login.formationFollowed.specialtyEngineer')}
              </MenuItem>
              <MenuItem value={'Mas'}>
                {t('login.formationFollowed.master')}
              </MenuItem>
              <MenuItem value={'Doc'}>
                {t('login.formationFollowed.PhD')}
              </MenuItem>
              <MenuItem value={'Bac'}>
                {t('login.formationFollowed.bachelor')}
              </MenuItem>
              <MenuItem value={'MSp'}>
                {t('login.formationFollowed.specializedMaster')}
              </MenuItem>
            </SelectField>
          </ListItem>
          <ListItem>
            <SelectField
              handleChange={(val) =>
                updateTempFilters({
                  path: val,
                })
              }
              value={tempFilters.path}
              label={t('login.specialProgram.label')}
            >
              <MenuItem value={undefined}>-</MenuItem>
              <MenuItem value={'Cla'}>
                {t('login.specialProgram.none')}
              </MenuItem>
              <MenuItem value={'Alt'}>
                {t('login.specialProgram.apprenticeship')}
              </MenuItem>
              <MenuItem value={'I-A'}>
                {t('login.specialProgram.engineerArchitect')}
              </MenuItem>
              <MenuItem value={'A-I'}>
                {t('login.specialProgram.architectEngineer')}
              </MenuItem>
              <MenuItem value={'I-M'}>
                {t('login.specialProgram.engineerManager')}
              </MenuItem>
              <MenuItem value={'M-I'}>
                {t('login.specialProgram.managerEngineer')}
              </MenuItem>
            </SelectField>
          </ListItem>
          <ListItem>
            <DateField
              label={t('student.arrivalYear')}
              value={
                tempFilters.promo
                  ? new Date(`${tempFilters.promo}-01-01`)
                  : null
              }
              views={['year']}
              onChange={(date) => {
                updateTempFilters({ promo: date?.getFullYear() });
              }}
              disableFuture
            />
          </ListItem>
        </List>
        <FlexRow mt={1} gap={1}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              updateFilters({ ...tempFilters, page: 1 });
              onClose();
            }}
          >
            {t('button.apply')}
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            {t('event.filters.reset')}
          </Button>
        </FlexRow>
      </Container>
    </Drawer>
  );
}
