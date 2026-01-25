import { Dispatch, useCallback } from 'react';

import {
  AccessTime as ClockIcon,
  ExpandMoreRounded as ExpandMoreIcon,
  LinkRounded as LinkIcon,
  PlaceOutlined as PlaceIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  InputAdornment,
  MenuItem,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { getGroupLabelApi } from '#modules/group/api/getGroupLabel.api';
import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { CreateGroupFormDTO } from '#modules/group/infra/group.dto';
import {
  CreateGroupForm as GroupForm,
  Group,
} from '#modules/group/types/group.types';
import { GroupTypePreview } from '#modules/group/types/groupType.types';
import { ShortMembershipForm } from '#modules/group/types/membership.types';
import { getGeocodeListApi } from '#modules/map/api/getGeocodeList.api';
import { Geocode } from '#modules/map/geocode.type';
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
import { AutocompleteAddressField } from '#shared/components/FormFields/AutocompleteAddressField';
import { RichTextField } from '#shared/components/FormFields/RichTextField';
import { SetObjectStateAction } from '#shared/hooks/useObjectState';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

interface GroupFormFieldsProps {
  isError: boolean;
  error: ApiFormError<CreateGroupFormDTO> | null;
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
  const addressCallback = useCallback(
    (val: string, objectValue: Geocode) =>
      updateFormValues({
        address: val,
        latitude: objectValue.latitude,
        longitude: objectValue.longitude,
      }),
    [updateFormValues],
  );
  const latitudeCallback = useCallback(
    (val) => updateFormValues({ latitude: val }),
    [updateFormValues],
  );
  const longitudeCallback = useCallback(
    (val) => updateFormValues({ longitude: val }),
    [updateFormValues],
  );
  const meetingPlaceCallback = useCallback(
    (val: string) => updateFormValues({ meetingPlace: val }),
    [updateFormValues],
  );
  const meetingHourCallback = useCallback(
    (val: string) => updateFormValues({ meetingHour: val }),
    [updateFormValues],
  );

  const today = new Date();
  const oneYear = new Date();
  oneYear.setFullYear(today.getFullYear() + 1);
  const updateMembership = (val: Partial<ShortMembershipForm> | undefined) => {
    if (typeof val === 'undefined') {
      updateFormValues({ membership: undefined });
    } else if (formValues.membership) {
      updateFormValues({ membership: { ...formValues.membership, ...val } });
    } else {
      updateFormValues({
        membership: {
          summary: '',
          description: '',
          beginDate: today,
          endDate: oneYear,
          ...val,
        },
      });
    }
  };

  return (
    <>
      <FormErrorAlert isError={isError} error={error} />

      <Typography variant="h3">{t('group.form.title.general')}</Typography>

      <FlexAuto columnGap={2}>
        <TextField
          name={'name'}
          key={'frenchTitle'}
          label={t('group.form.name.french_label')}
          value={formValues.frenchName}
          handleChange={useCallback(
            (val) => {
              updateFormValues({ frenchName: val });
            },
            [updateFormValues],
          )}
          errors={error?.fields?.french_name}
          required
        />
        <TextField
          name={'englishName'}
          key={'englishTitle'}
          label={t('group.form.name.english_label')}
          value={formValues.englishName}
          handleChange={useCallback(
            (val) => {
              updateFormValues({ englishName: val });
            },
            [updateFormValues],
          )}
          errors={error?.fields?.english_name}
          required
        />
      </FlexAuto>
      <FlexAuto columnGap={2}>
        <TextField
          label={t('group.form.shortName.french_label')}
          value={formValues.frenchShortName}
          handleChange={useCallback(
            (val) => {
              updateFormValues({ frenchShortName: val });
            },
            [updateFormValues],
          )}
          helperText={t('group.form.shortName.helperText')}
          errors={error?.fields?.french_short_name}
        />
        <TextField
          label={t('group.form.shortName.english_label')}
          value={formValues.englishShortName}
          handleChange={useCallback(
            (val) => {
              updateFormValues({ englishShortName: val });
            },
            [updateFormValues],
          )}
          errors={error?.fields?.english_short_name}
        />
      </FlexAuto>

      {!edit && (
        <>
          <FlexAuto columnGap={2}>
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
          <Box>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {t('group.form.initialMember.title')}
              </AccordionSummary>
              <AccordionDetails>
                <CheckboxField
                  label={t('group.form.initialMember.enable')}
                  handleChange={(val) => updateMembership(val ? {} : undefined)}
                  value={Boolean(formValues.membership)}
                  helperText={t('group.form.initialMember.enableHint')}
                />
                {!groupType.noMembershipDates && (
                  <FlexAuto gap={2}>
                    <DateField
                      label={t('group.form.beginDate.label')}
                      value={formValues.membership?.beginDate ?? null}
                      onChange={(val) => {
                        updateMembership({ beginDate: val ?? undefined });
                      }}
                      errors={error?.fields?.membership?.begin_date}
                      fullWidth
                      required
                      disabled={!formValues.membership}
                    />
                    <DateField
                      label={t('group.form.endDate.label')}
                      minDate={formValues.membership?.beginDate}
                      value={formValues.membership?.endDate ?? null}
                      onChange={(val) => {
                        updateMembership({ endDate: val ?? undefined });
                      }}
                      errors={error?.fields?.membership?.end_date}
                      fullWidth
                      required
                      disabled={!formValues.membership}
                    />
                  </FlexAuto>
                )}
                <TextField
                  label={t('group.details.form.summary.label')}
                  value={formValues.membership?.summary ?? ''}
                  handleChange={(val) =>
                    updateMembership({ summary: val ?? undefined })
                  }
                  errors={error?.fields?.membership?.summary}
                  disabled={!formValues.membership}
                />
                <TextField
                  label={t('group.details.form.description.label')}
                  value={formValues.membership?.description ?? ''}
                  handleChange={(val) =>
                    updateMembership({ description: val ?? undefined })
                  }
                  errors={error?.fields?.membership?.description}
                  multiline
                  disabled={!formValues.membership}
                />
              </AccordionDetails>
            </Accordion>
          </Box>
        </>
      )}

      <TextField
        label={t('group.form.changeReason.label')}
        value={formValues.changeReason}
        handleChange={useCallback(
          (val) => {
            updateFormValues({ changeReason: val });
          },
          [updateFormValues],
        )}
        helperText={t('group.form.changeReason.helperText')}
        errors={error?.fields?._change_reason}
      />

      <FlexAuto columnGap={2}>
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
        {t('group.form.title.presentation')}
      </Typography>

      {groupType.isMap && (
        <AutocompleteAddressField
          label={t('group.form.address.label')}
          value={formValues.address}
          handleChange={addressCallback}
          errors={error?.fields?.address}
          fetchOptions={getGeocodeListApi}
          initialObjectValue={{
            address: formValues.address,
            latitude: formValues.latitude,
            longitude: formValues.longitude,
          }}
          labelPropName={'address'}
          required
        />
      )}
      <TextField
        label={
          groupType.isMap
            ? t('group.form.summary.mapLabel')
            : t('group.form.summary.frenchLabel')
        }
        value={formValues.frenchSummary}
        handleChange={useCallback(
          (val) => {
            updateFormValues({ frenchSummary: val });
          },
          [updateFormValues],
        )}
        errors={error?.fields?.french_summary}
        placeholder={
          groupType.isMap ? t('group.form.summary.mapPlaceholder') : undefined
        }
      />
      <TextField
        hidden={groupType.isMap}
        label={
          groupType.isMap
            ? t('group.form.summary.mapLabel')
            : t('group.form.summary.englishLabel')
        }
        value={formValues.englishSummary}
        handleChange={useCallback(
          (val) => {
            updateFormValues({ englishSummary: val });
          },
          [updateFormValues],
        )}
        errors={error?.fields?.english_summary}
        placeholder={
          groupType.isMap ? t('group.form.summary.mapPlaceholder') : undefined
        }
      />
      {groupType.isMap ? (
        <FlexAuto columnGap={2}>
          <TextField
            label={t('group.form.latitude.label')}
            helperText={t('group.form.latitude.helperText')}
            value={formValues.latitude}
            handleChange={latitudeCallback}
            errors={error?.fields?.latitude}
          />
          <TextField
            label={t('group.form.longitude.label')}
            helperText={t('group.form.latitude.helperText')}
            value={formValues.longitude}
            handleChange={longitudeCallback}
            errors={error?.fields?.longitude}
          />
        </FlexAuto>
      ) : (
        <FlexAuto columnGap={2}>
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <PlaceIcon />
                </InputAdornment>
              ),
            }}
            label={t('group.form.meetingPlace.label')}
            value={formValues.meetingPlace}
            handleChange={meetingPlaceCallback}
            errors={error?.fields?.meeting_place}
          />
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <ClockIcon />
                </InputAdornment>
              ),
            }}
            label={t('group.form.meetingHour.label')}
            value={formValues.meetingHour}
            handleChange={meetingHourCallback}
            errors={error?.fields?.meeting_hour}
          />
        </FlexAuto>
      )}

      <FlexAuto columnGap={2}>
        <TextField
          label={t('group.form.video1.label')}
          type="url"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <LinkIcon />
              </InputAdornment>
            ),
          }}
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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <LinkIcon />
              </InputAdornment>
            ),
          }}
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

      <RichTextField
        label={t('group.form.description.frenchLabel')}
        value={formValues.frenchDescription}
        handleChange={useCallback(
          (val) => {
            updateFormValues({ frenchDescription: val });
          },
          [updateFormValues],
        )}
        errors={error?.fields?.french_description}
      />

      <RichTextField
        label={t('group.form.description.englishLabel')}
        value={formValues.englishDescription}
        handleChange={useCallback(
          (val) => {
            updateFormValues({ englishDescription: val });
          },
          [updateFormValues],
        )}
        errors={error?.fields?.english_description}
      />

      <Box mt={2}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {t('group.form.title.advancedOptions')}
          </AccordionSummary>
          <AccordionDetails>
            <FlexCol gap={2}>
              {groupType.canHaveParent && (
                <AutocompleteSearchField
                  name="parent"
                  label={t('group.form.parent.label')}
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
      </Box>
    </>
  );
}
