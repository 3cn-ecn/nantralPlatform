import { Dispatch } from 'react';

import { MenuItem, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { getSocialNetworksApi } from '#modules/social_link/api/getSocialNetworks.api';
import { SocialLinkDTO } from '#modules/social_link/infra/socialLink.dto';
import { SocialLinkForm } from '#modules/social_link/types/socialLink.type';
import { FlexAuto, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { SelectField, TextField } from '#shared/components/FormFields';
import { SetObjectStateAction } from '#shared/hooks/useObjectState';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

interface SocialLinkFormFieldsProps {
  isError: boolean;
  error: ApiFormError<SocialLinkDTO> | null;
  formValues: SocialLinkForm;
  updateFormValues: Dispatch<SetObjectStateAction<SocialLinkForm>>;
}

export function SocialLinkFormFields({
  formValues,
  error,
  updateFormValues,
}: SocialLinkFormFieldsProps) {
  const { data: networks, isLoading } = useQuery({
    queryFn: getSocialNetworksApi,
    queryKey: ['networks'],
  });
  const { t } = useTranslation();

  return (
    <>
      <TextField
        handleChange={(val) => {
          updateFormValues({ uri: val });
        }}
        type={'url'}
        label={t('socialLink.form.url.label')}
        value={formValues.uri}
        errors={error?.fields?.uri}
        required
      />
      <FlexAuto sx={{ columnGap: 2 }}>
        <SelectField
          errors={error?.fields?.network}
          handleChange={(val) => {
            updateFormValues({ network: parseInt(val) });
          }}
          label={t('socialLink.form.network.label')}
          value={formValues.network == -1 ? '' : formValues.network.toString()}
          disabled={isLoading}
          required
        >
          {networks?.results.map((network) => {
            return (
              <MenuItem key={network.id} value={network.id.toString()}>
                <FlexRow alignItems={'center'} gap={1}>
                  {<i className={network.iconName} />}
                  <Typography>{network.name}</Typography>
                </FlexRow>
              </MenuItem>
            );
          })}
        </SelectField>
        <TextField
          label={t('socialLink.form.label.label')}
          handleChange={(val) => {
            updateFormValues({ label: val });
          }}
          value={formValues.label}
        />
      </FlexAuto>
    </>
  );
}
