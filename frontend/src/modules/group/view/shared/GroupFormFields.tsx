import { Dispatch, useCallback } from 'react';

import {
  AccessTimeFilled,
  ExpandMoreRounded,
  LinkRounded,
  Place,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  MenuItem,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { getGroupLabelApi } from '#modules/group/api/getGroupLabel.api';
import {
  Group,
  CreateGroupForm as GroupForm,
} from '#modules/group/types/group.types';
import { FlexAuto, FlexCol } from '#shared/components/FlexBox/FlexBox';
import { FormErrorAlert } from '#shared/components/FormErrorAlert/FormErrorAlert';
import {
  CheckboxField,
  DateField,
  FileField,
  SelectField,
  TextField,
} from '#shared/components/FormFields';
import { RichTextField } from '#shared/components/FormFields/RichTextField';
import { SetObjectStateAction } from '#shared/hooks/useObjectState';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

interface EventFormFieldsProps {
  isError: boolean;
  error: ApiFormError<GroupForm> | null;
  formValues: GroupForm;
  updateFormValues: Dispatch<SetObjectStateAction<GroupForm>>;
  prevData?: Group;
  groupType: string;
  // selectedLang: BaseLanguage;
}

export function GroupFormFields({
  isError,
  error,
  formValues,
  updateFormValues,
  prevData,
  groupType,
  // selectedLang,
}: EventFormFieldsProps) {
  const { t } = useTranslation();
  const { data, isSuccess } = useQuery({
    queryFn: () => getGroupLabelApi({ groupType: groupType }),
    queryKey: ['getGroupLabels', groupType],
  });

  return (
    <>
      <FormErrorAlert isError={isError} error={error} />
      <Typography variant="h2" mt={2}>
        Général
      </Typography>
      <FlexAuto gap={2}>
        <TextField
          name="name"
          key={'title'}
          label={'Nom'}
          value={formValues.name}
          handleChange={useCallback(
            (val) => {
              updateFormValues({ name: val });
            },
            [updateFormValues],
          )}
          errors={error?.fields?.name}
          required
        />
        <TextField
          label={'Nom raccourci'}
          value={formValues.shortName}
          handleChange={useCallback(
            (val) => {
              updateFormValues({ shortName: val });
            },
            [updateFormValues],
          )}
          errors={error?.fields?.shortName}
        />
      </FlexAuto>

      <FlexAuto gap={2} alignItems={'center'}>
        <DateField
          label={'Date de création'}
          defaultValue={new Date()}
          views={['year']}
          onChange={(date) =>
            updateFormValues({ creationYear: date?.getFullYear() })
          }
          disableFuture
          required
        />
        <SelectField
          handleChange={useCallback(
            (val) => updateFormValues({ label: Number.parseInt(val) }),
            [updateFormValues],
          )}
          label={'label'}
          disabled={!isSuccess || data.count === 0}
          defaultValue={'-1'}
          value={formValues.label?.toString()}
          errors={error?.fields?.label}
        >
          <MenuItem value={'-1'}>{'Aucun'}</MenuItem>
          {data?.results.map((label) => (
            <MenuItem key={label.id} value={label.id}>
              {label.name}
            </MenuItem>
          ))}
        </SelectField>
      </FlexAuto>
      <Typography variant="h2" mt={2}>
        Images
      </Typography>
      <FlexAuto gap={2}>
        <FileField
          name="icon"
          label={'Icône'}
          helperText={''}
          value={formValues.icon}
          handleChange={useCallback(
            (val) => updateFormValues({ icon: val }),
            [updateFormValues],
          )}
          prevFileName={prevData?.icon}
          errors={error?.fields?.icon}
          accept="image/*"
        />
        <FileField
          name="banner"
          label={'Bannière'}
          helperText={''}
          value={formValues.banner}
          handleChange={useCallback(
            (val) => updateFormValues({ banner: val }),
            [updateFormValues],
          )}
          prevFileName={prevData?.banner}
          errors={error?.fields?.banner}
          accept="image/*"
        />
      </FlexAuto>
      <Typography variant="h2" mt={2}>
        Videos
      </Typography>
      <FlexAuto gap={2}>
        <TextField
          label={'Vidéo 1'}
          type="url"
          InputProps={{ endAdornment: <LinkRounded /> }}
          value={formValues.video1}
          handleChange={useCallback(
            (val) => {
              updateFormValues({ video1: val });
            },
            [updateFormValues],
          )}
          errors={error?.fields?.video1}
        />
        <TextField
          label={'Vidéo 2'}
          InputProps={{ endAdornment: <LinkRounded /> }}
          type="url"
          value={formValues.video2}
          handleChange={useCallback(
            (val) => {
              updateFormValues({ video2: val });
            },
            [updateFormValues],
          )}
          errors={error?.fields?.video2}
        />
      </FlexAuto>
      <Typography variant="h2" mt={2}>
        Informations
      </Typography>
      <TextField
        label={'Résumé'}
        value={formValues.summary}
        handleChange={useCallback(
          (val) => {
            updateFormValues({ summary: val });
          },
          [updateFormValues],
        )}
        errors={error?.fields?.summary}
      />
      <FlexAuto columnGap={2} breakPoint="sm">
        <TextField
          InputProps={{ endAdornment: <Place sx={{ mr: 1 }} /> }}
          label={'Lieu de réunion'}
          value={formValues.meetingPlace}
          handleChange={useCallback(
            (val) => updateFormValues({ meetingPlace: val }),
            [updateFormValues],
          )}
          errors={error?.fields?.meetingPlace}
        />
        <TextField
          InputProps={{ endAdornment: <AccessTimeFilled sx={{ mr: 1 }} /> }}
          label={'Heure de réunion'}
          value={formValues.meetingHour}
          handleChange={useCallback(
            (val) => updateFormValues({ meetingHour: val }),
            [updateFormValues],
          )}
          errors={error?.fields?.meetingHour}
        />
      </FlexAuto>
      <RichTextField
        label={t('event.form.description.label')}
        value={formValues.description}
        handleChange={useCallback(
          (val) => {
            updateFormValues({ description: val });
          },
          [updateFormValues],
        )}
        errors={error?.fields?.description}
      />

      <Accordion sx={{ mt: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreRounded />}>
          Options avancées
        </AccordionSummary>
        <AccordionDetails>
          <FlexCol gap={2}>
            <CheckboxField
              label="Public"
              value={formValues?.public}
              helperText="Visible pour les utilisateurs non connectés. Les membres et les évènements resterons toutefois cachés."
              errors={error?.fields?.public}
              handleChange={useCallback(
                (val: boolean) => updateFormValues({ public: val }),
                [updateFormValues],
              )}
            />
            <CheckboxField
              label="Private"
              value={formValues?.private}
              helperText="Rendre le club non visible pour tout le monde sauf les membres"
              errors={error?.fields?.private}
              handleChange={useCallback(
                (val: boolean) => updateFormValues({ private: val }),
                [updateFormValues],
              )}
            />
            <CheckboxField
              label="Archiver"
              value={formValues?.archived}
              helperText="Archiver le club. Il ne sera plus visible sur nantral platform."
              errors={error?.fields?.archived}
              handleChange={useCallback(
                (val: boolean) => updateFormValues({ archived: val }),
                [updateFormValues],
              )}
            />
          </FlexCol>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
