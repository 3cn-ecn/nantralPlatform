import { Divider, MenuItem, Typography } from '@mui/material';

import { RegisterForm } from '#modules/account/account.type';
import {
  EditAccountOptions,
  EditAccountOptionsDTO,
} from '#modules/account/api/editAccount';
import { Student } from '#modules/student/student.types';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import {
  FileField,
  SelectField,
  TextField,
} from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { StudentDetailsInfo } from '../StudentDetailsInfo';

export function EditProfileFormFields({
  formValues,
  previousValues,
  updateFormValues,
  error,
}: {
  formValues: EditAccountOptions;
  previousValues: Student;
  updateFormValues: (val: Partial<EditAccountOptions>) => void;
  error: ApiFormError<EditAccountOptionsDTO> | null;
}) {
  function convertPictureToURL() {
    if (formValues.picture) {
      if (formValues.picture.name === '') {
        return '';
      } else {
        return URL.createObjectURL(formValues.picture);
      }
    }
    return previousValues.picture;
  }
  function convertToPreview(form: EditAccountOptions): Student {
    return {
      description: form.description,
      faculty: form.faculty,
      name: form.firstName + ' ' + form.lastName.toUpperCase(),
      id: -1,
      path: form.path,
      picture: convertPictureToURL(),
      promo: form.promo,
      socialLinks: [],
      staff: false,
      url: '',
      username: form.username,
    };
  }
  const { t } = useTranslation();
  return (
    <>
      <Typography
        sx={{ textDecorationLine: 'underline' }}
        align="right"
        variant="caption"
      >
        Preview
      </Typography>
      <FlexRow>
        <Avatar
          alt={formValues.firstName + ' ' + formValues.lastName.toUpperCase()}
          src={convertPictureToURL()}
          size="xl"
          sx={{ m: 1 }}
        />
        <StudentDetailsInfo student={convertToPreview(formValues)} />
      </FlexRow>
      <Divider sx={{ my: 2 }} />
      <FileField
        value={formValues.picture}
        prevFileName={previousValues.picture}
        handleChange={(val) => updateFormValues({ picture: val })}
        name="picture"
        label={t('student.picture.label')}
        helperText={t('student.picture.helperText')}
        errors={error?.fields?.student?.picture}
      />
      <TextField
        value={formValues.firstName}
        handleChange={(val) => updateFormValues({ firstName: val })}
        label="Prénom"
        required
        errors={error?.fields?.first_name}
      />
      <TextField
        value={formValues.lastName}
        handleChange={(val) => updateFormValues({ lastName: val })}
        label="Nom"
        required
        errors={error?.fields?.last_name}
      />
      <TextField
        value={formValues.username}
        handleChange={(val) => updateFormValues({ username: val })}
        label="Nom d'utilisateur"
        errors={error?.fields?.username}
        required
      />
      <TextField
        handleChange={(val) => updateFormValues({ description: val })}
        label="description"
        placeholder="Describe yourself in one or two sentence"
        rows={2}
        value={formValues.description}
        errors={error?.fields?.student?.description}
        multiline
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
        errors={error?.fields?.student?.faculty}
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
        errors={error?.fields?.student?.path}
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
