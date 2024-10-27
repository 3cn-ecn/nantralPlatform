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
import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import {
  Group,
  CreateGroupForm as GroupForm,
} from '#modules/group/types/group.types';
import { GroupTypePreview } from '#modules/group/types/groupType.types';
import { FlexAuto, FlexCol } from '#shared/components/FlexBox/FlexBox';
import { FormErrorAlert } from '#shared/components/FormErrorAlert/FormErrorAlert';
import {
  AutocompleteSearchField,
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

interface GroupFormFieldsProps {
  isError: boolean;
  error: ApiFormError<GroupForm> | null;
  formValues: GroupForm;
  updateFormValues: Dispatch<SetObjectStateAction<GroupForm>>;
  prevData?: Partial<Group>;
  groupType: GroupTypePreview;
  edit?: boolean;
  // selectedLang: BaseLanguage;
}

export function GroupFormFields({
  isError,
  error,
  formValues,
  updateFormValues,
  prevData,
  groupType,
  edit = false,
}: GroupFormFieldsProps) {
  const { t } = useTranslation();
  const { data, isSuccess } = useQuery({
    queryFn: () => getGroupLabelApi({ groupType: groupType.slug }),
    queryKey: ['getGroupLabels', groupType],
  });
  const parentCallback = useCallback(
    (val: number) => updateFormValues({ parent: val }),
    [updateFormValues],
  );
  const fetchInitialOptions = useCallback(
    () =>
      getGroupListApi({ hasNoParent: true, type: groupType.slug }).then(
        (res) => res.results,
      ),
    [groupType.slug],
  );

  return (
    <>
      <FormErrorAlert isError={isError} error={error} />
      <Typography variant="h3">{t('group.form.title.general')}</Typography>
      <FlexAuto gap={2}>
        <TextField
          name={'name'}
          key={'title'}
          label={t('group.form.name.label')}
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
          label={t('group.form.shortName.label')}
          value={formValues.shortName}
          handleChange={useCallback(
            (val) => {
              updateFormValues({ shortName: val });
            },
            [updateFormValues],
          )}
          helperText={t('group.form.shortName.helperText')}
          errors={error?.fields?.shortName}
        />
      </FlexAuto>

      {!edit && (
        <FlexAuto gap={2} alignItems={'center'}>
          <DateField
            label={t('group.form.creationDate.label')}
            defaultValue={new Date()}
            views={['year']}
            onChange={(date) =>
              updateFormValues({ creationYear: date?.getFullYear() })
            }
            disableFuture
            required
            fullWidth
          />
          <SelectField
            handleChange={(val) =>
              updateFormValues({ label: Number.parseInt(val) })
            }
            label={t('group.form.label.label')}
            disabled={!isSuccess || data.count === 0}
            defaultValue={'-1'}
            value={formValues.label?.toString()}
            errors={error?.fields?.label}
          >
            <MenuItem value={'-1'}>{t('group.form.label.none')}</MenuItem>
            {data?.results.map((label) => (
              <MenuItem key={label.id} value={label.id}>
                {label.name}
              </MenuItem>
            ))}
          </SelectField>
        </FlexAuto>
      )}
      <Typography mt={2} variant="h3">
        {t('group.form.title.images')}
      </Typography>
      <FlexAuto gap={2}>
        <FileField
          name="icon"
          label={t('group.form.icon.label')}
          value={formValues.icon}
          handleChange={useCallback(
            (val) => updateFormValues({ icon: val }),
            [updateFormValues],
          )}
          helperText={t('group.form.icon.helperText')}
          prevFileName={prevData?.icon}
          errors={error?.fields?.icon}
          accept="image/*"
        />
        <FileField
          name="banner"
          label={t('group.form.banner.label')}
          helperText={t('group.form.banner.helperText')}
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

      <Typography mt={2} variant="h3">
        {t('group.form.title.videos')}
      </Typography>
      <FlexAuto gap={2}>
        <TextField
          label={t('group.form.video1.label')}
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
          label={t('group.form.video2.label')}
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

      <Typography mt={2} variant="h3">
        {t('group.form.title.additionalInformation')}
      </Typography>
      <TextField
        label={t('group.form.summary.label')}
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
          label={t('group.form.meetingPlace.label')}
          value={formValues.meetingPlace}
          handleChange={useCallback(
            (val) => updateFormValues({ meetingPlace: val }),
            [updateFormValues],
          )}
          errors={error?.fields?.meetingPlace}
        />
        <TextField
          InputProps={{ endAdornment: <AccessTimeFilled sx={{ mr: 1 }} /> }}
          label={t('group.form.meetingHour.label')}
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
          {t('group.form.title.advancedOptions')}
        </AccordionSummary>
        <AccordionDetails>
          <FlexCol gap={2}>
            {groupType.canHaveParent && (
              <AutocompleteSearchField
                name="parent"
                label={'Parent'}
                value={formValues.parent || null}
                handleChange={parentCallback}
                defaultObjectValue={prevData?.parent || null}
                errors={error?.fields?.parent}
                fetchInitialOptions={fetchInitialOptions}
                fetchOptions={(inputValue) =>
                  getGroupListApi({
                    parent: null,
                    type: groupType.slug,
                    search: inputValue,
                  }).then((res) => res.results)
                }
                labelPropName="name"
                imagePropName="icon"
              />
            )}

            <CheckboxField
              value={formValues.lockMemberships}
              label={t('group.form.lockMemberships.label')}
              helperText={t('group.form.lockMemberships.helperText')}
              handleChange={useCallback(
                (val) => updateFormValues({ lockMemberships: val }),
                [updateFormValues],
              )}
            />

            <CheckboxField
              label={t('group.form.public.label')}
              value={formValues?.public}
              helperText={t('group.form.public.helperText')}
              errors={error?.fields?.public}
              handleChange={useCallback(
                (val: boolean) => updateFormValues({ public: val }),
                [updateFormValues],
              )}
            />
            <CheckboxField
              label={t('group.form.private.label')}
              value={formValues?.private}
              helperText={t('group.form.private.helperText')}
              errors={error?.fields?.private}
              handleChange={useCallback(
                (val: boolean) => updateFormValues({ private: val }),
                [updateFormValues],
              )}
            />
            <CheckboxField
              label={t('group.form.archive.label')}
              value={formValues?.archived}
              helperText={t('group.form.archive.helperText')}
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
