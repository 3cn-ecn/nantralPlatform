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
              value={filters.faculty}
              handleChange={(val) => updateFilters({ faculty: val })}
            >
              <MenuItem value={undefined}>-</MenuItem>
              <MenuItem value={'Gen'}>
                {t('login.formationFollowed.generalEngineer')}
              </MenuItem>
              <MenuItem value={'Iti'}>
                {t('login.formationFollowed.specialtyEngineer')}
              </MenuItem>
              <MenuItem value={'Mst'}>
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
                updateFilters({
                  path: val,
                })
              }
              value={filters.path}
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
              value={filters.promo ? new Date(`${filters.promo}-01-01`) : null}
              views={['year']}
              onChange={(date) => {
                updateFilters({ promo: date?.getFullYear() });
              }}
              disableFuture
            />
          </ListItem>
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
