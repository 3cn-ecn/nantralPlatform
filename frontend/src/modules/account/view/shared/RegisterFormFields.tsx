import { useCallback } from 'react';

import { AccountCircle, School } from '@mui/icons-material';
import { Autocomplete, Divider, Typography } from '@mui/material';
import MuiTextField from '@mui/material/TextField';

import { RegisterForm } from '#modules/account/account.type';
import { DateField, TextField } from '#shared/components/FormFields';
import { PasswordField } from '#shared/components/FormFields/PasswordField';

interface RegisterFormFieldsProps {
  error: { fields: Partial<Record<keyof RegisterForm, string[]>> };
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
  // const { t } = useTranslation();

  return (
    <>
      <Typography
        variant="h4"
        color={'primary'}
        sx={{ alignItems: 'center', display: 'flex', columnGap: 1 }}
      >
        <AccountCircle /> Account Informations
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
            ? 'Your personal email'
            : 'Your email address ec-nantes.fr'
        }
      />
      <TextField
        label={'First Name'}
        value={formValues.firstName}
        handleChange={useCallback(
          (val) => updateFormValues({ firstName: val }),
          [updateFormValues],
        )}
        errors={error?.fields?.firstName}
        required
      />
      <TextField
        label={'Last Name'}
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
        label={'Password'}
        errors={error?.fields?.password}
        helperText={'Your password must contain at least 7 characters.'}
        sx={{ marginTop: 3 }}
        required
      />
      <PasswordField
        handleChange={useCallback(
          (val) => updateFormValues({ passwordConfirm: val }),
          [updateFormValues],
        )}
        label={'Confirm your password'}
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
        Schooling
      </Typography>

      <Divider sx={{ marginTop: 1 }} />
      <DateField
        format="yyyy"
        label={'Year of arrival at Centrale Nantes'}
        defaultValue={new Date()}
        sx={{ marginTop: 3 }}
        views={['year']}
        onChange={(date) => updateFormValues({ promo: date?.getFullYear() })}
        disableFuture
        required
        fullWidth
      />
      <Autocomplete
        sx={{ marginTop: 2, marginBottom: 3 }}
        value={formValues?.faculty}
        getOptionLabel={(option) => option.label}
        onChange={(_, value: RegisterForm['faculty']) =>
          updateFormValues({ faculty: value })
        }
        options={[
          { label: 'Ingénieur généraliste', value: 'Gen' },
          { label: 'Ingénieur de spécialité (ITII)', value: 'Iti' },
          { label: 'Master', value: 'Mst' },
          { label: 'Doctorat', value: 'Doc' },
          { label: 'Bachelor', value: 'Bac' },
          { label: 'Mastère Spécialisé', value: 'MSp' },
        ]}
        renderInput={(params) => (
          <MuiTextField {...params} label="Formation followed" required />
        )}
      />
      <Autocomplete
        sx={{ marginTop: 2, marginBottom: 4 }}
        value={formValues?.path}
        defaultValue={{ label: 'None', value: 'Cla' }}
        getOptionLabel={(option) => option.label}
        onChange={(_, value: RegisterForm['path']) =>
          updateFormValues({ path: value || undefined })
        }
        options={[
          { label: 'None', value: 'Cla' },
          { label: 'Apprenticeship', value: 'Alt' },
          { label: 'Engineer-Architect', value: 'I-A' },
          { label: 'Architect-Engineer', value: 'A-I' },
          { label: 'Engineer-Manager', value: 'I-M' },
          { label: 'Manager-Engineer', value: 'M-I' },
        ]}
        renderInput={(params) => (
          <MuiTextField
            {...params}
            label="Special Program"
            helperText={
              error.fields?.path ||
              'Special program your in central. You can change it later'
            }
          />
        )}
      />
    </>
  );
}
