import { useCallback } from 'react';

import { AccountCircle, School } from '@mui/icons-material';
import { Divider, MenuItem, Typography } from '@mui/material';

import { RegisterForm } from '#modules/account/account.type';
import {
  DateField,
  SelectField,
  TextField,
} from '#shared/components/FormFields';
import { PasswordField } from '#shared/components/FormFields/PasswordField';
import { useTranslation } from '#shared/i18n/useTranslation';

interface RegisterFormFieldsProps {
  error: { fields: Partial<Record<keyof RegisterForm, string[]>> } | null;
  formValues: RegisterForm & { passwordConfirm: string };
  updateFormValues: (newValue: Partial<RegisterForm>) => void;
  registrationType?: 'invitation' | 'normal';
}

export function RegisterFormFields({
  error,
  formValues,
  updateFormValues,
  registrationType = 'normal',
}: RegisterFormFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <Typography
        variant="h4"
        color={'primary'}
        sx={{ alignItems: 'center', display: 'flex', columnGap: 1 }}
      >
        <AccountCircle /> {t('register.accountInformations')}
      </Typography>
      <Divider sx={{ marginTop: 1 }} />
      <TextField
        name="email"
        label={'Email'}
        type="email"
        value={formValues.email}
        handleChange={useCallback(
          (val) => updateFormValues({ email: val }),
          [updateFormValues],
        )}
        errors={error?.fields?.email}
        required
        helperText={
          registrationType === 'invitation'
            ? t('register.personalEmail')
            : t('register.ECNEmail')
        }
      />
      <TextField
        label={t('register.firstName')}
        value={formValues.firstName}
        handleChange={useCallback(
          (val) => updateFormValues({ firstName: val }),
          [updateFormValues],
        )}
        errors={error?.fields?.firstName}
        required
      />
      <TextField
        label={t('register.lastName')}
        value={formValues.lastName}
        handleChange={useCallback(
          (val) => updateFormValues({ lastName: val }),
          [updateFormValues],
        )}
        errors={error?.fields?.lastName}
        required
        sx={{ marginBottom: 2 }}
      />
      <PasswordField
        handleChange={useCallback(
          (val) => updateFormValues({ password: val }),
          [updateFormValues],
        )}
        label={t('login.password')}
        errors={error?.fields?.password}
        helperText={t('register.passwordHelperText')}
        sx={{ marginTop: 3 }}
        required
      />
      <PasswordField
        handleChange={useCallback(
          (val) => updateFormValues({ passwordConfirm: val }),
          [updateFormValues],
        )}
        label={t('login.passwordConfirm')}
        errors={error?.fields?.passwordConfirm}
        visibilityIconHidden
        showValidateIcon={
          !!formValues?.password &&
          formValues.password === formValues?.passwordConfirm
        }
        sx={{ marginTop: 2, marginBottom: 3 }}
        required
      />
      <Typography
        variant="h4"
        color={'primary'}
        sx={{ alignItems: 'center', display: 'flex', columnGap: 1 }}
      >
        <School />
        {t('register.schooling')}
      </Typography>

      <Divider sx={{ marginTop: 1 }} />
      <DateField
        label={t('login.arrivalYear')}
        defaultValue={new Date()}
        sx={{ marginTop: 3 }}
        views={['year']}
        onChange={(date) => updateFormValues({ promo: date?.getFullYear() })}
        disableFuture
        required
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
      >
        <MenuItem value={'Gen'}>
          {t('login.formationFollowed.generalEngineer')}
        </MenuItem>
        <MenuItem value={'Iti'}>
          {t('login.formationFollowed.specialtyEngineer')}
        </MenuItem>
        <MenuItem value={'Mst'}>{t('login.formationFollowed.master')}</MenuItem>
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
        helperText={t('login.specialProgram.helperText')}
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
