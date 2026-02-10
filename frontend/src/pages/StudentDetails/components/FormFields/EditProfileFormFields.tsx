import { MenuItem, Typography } from '@mui/material';

import { RegisterForm } from '#modules/account/account.type';
import {
  EditAccountOptions,
  EditAccountOptionsDTO,
} from '#modules/account/api/editAccount.api';
import { User } from '#modules/account/user.types';
import {
  DateField,
  FileField,
  SelectField,
  TextField,
} from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

export function EditProfileFormFields({
  formValues,
  previousValues,
  updateFormValues,
  error,
}: {
  formValues: EditAccountOptions;
  previousValues: User;
  updateFormValues: (val: Partial<EditAccountOptions>) => void;
  error: ApiFormError<EditAccountOptionsDTO> | null;
}) {
  const { t } = useTranslation();
  return (
    <>
      <FileField
        value={formValues.picture}
        prevFileName={previousValues.picture}
        handleChange={(val) => updateFormValues({ picture: val })}
        name="picture"
        label={t('student.picture.label')}
        helperText={t('student.picture.helperText')}
        errors={error?.fields?.picture}
        accept="image/*"
      />
      <TextField
        value={formValues.firstName}
        handleChange={(val) => updateFormValues({ firstName: val })}
        label={t('student.firstName.label')}
        required
        errors={error?.fields?.first_name}
      />
      <TextField
        value={formValues.lastName}
        handleChange={(val) => updateFormValues({ lastName: val })}
        label={t('student.lastName.label')}
        required
        errors={error?.fields?.last_name}
      />
      <TextField
        handleChange={(val) => updateFormValues({ description: val })}
        label={t('student.description.label')}
        placeholder={t('student.description.placeholder')}
        rows={2}
        value={formValues.description}
        errors={error?.fields?.description}
        multiline
      />
      <Typography variant="h3" m={1}>
        {t('student.details.schooling')}
      </Typography>
      <DateField
        label={t('login.arrivalYear')}
        defaultValue={new Date()}
        value={new Date(`${formValues.promo}-01-01`)}
        sx={{ marginTop: 3 }}
        views={['year']}
        onChange={(date) => updateFormValues({ promo: date?.getFullYear() })}
        disableFuture
        fullWidth
      />
      <SelectField
        handleChange={(value: RegisterForm['faculty']) =>
          updateFormValues({
            faculty: value,
          })
        }
        required
        value={formValues?.faculty}
        label={t('login.formationFollowed.label')}
        errors={error?.fields?.faculty}
      >
        <MenuItem value={'Gen'}>
          {t('login.formationFollowed.generalEngineer')}
        </MenuItem>
        <MenuItem value={'Iti'}>
          {t('login.formationFollowed.specialtyEngineer')}
        </MenuItem>
        <MenuItem value={'Mas'}>{t('login.formationFollowed.master')}</MenuItem>
        <MenuItem value={'Doc'}>{t('login.formationFollowed.PhD')}</MenuItem>
        <MenuItem value={'Bac'}>
          {t('login.formationFollowed.bachelor')}
        </MenuItem>
        <MenuItem value={'MSp'}>
          {t('login.formationFollowed.specializedMaster')}
        </MenuItem>
      </SelectField>
      <SelectField
        handleChange={(value: RegisterForm['path']) =>
          updateFormValues({
            path: value,
          })
        }
        value={formValues?.path}
        label={t('login.specialProgram.label')}
        errors={error?.fields?.path}
      >
        <MenuItem value={'Cla'}>{t('login.specialProgram.none')}</MenuItem>
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
    </>
  );
}
