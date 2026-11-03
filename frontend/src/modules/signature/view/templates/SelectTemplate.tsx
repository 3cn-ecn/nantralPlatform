import { Dispatch, SetStateAction, useCallback } from 'react';

import { HelpOutlined } from '@mui/icons-material';
import { MenuItem, Stack, Tooltip } from '@mui/material';

import { SignatureInfo } from '#modules/signature/signature.type';
import { SelectField } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';

export type TemplateType = 'ecn' | 'international' | `@${string}`;

interface SelectTemplateProps {
  template: TemplateType;
  setTemplate: Dispatch<SetStateAction<TemplateType>>;
  clubMemberships?: SignatureInfo['clubMemberships'];
}

export function SelectTemplate({
  template,
  setTemplate,
  clubMemberships,
}: SelectTemplateProps) {
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      <SelectField
        label={t('signature.template.label')}
        value={template}
        handleChange={useCallback(
          (value: TemplateType) => setTemplate(value),
          [setTemplate],
        )}
        fullWidth={false}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="ecn">{t('signature.template.ecn')}</MenuItem>
        <MenuItem value="international">
          {t('signature.template.international')}
        </MenuItem>
        {clubMemberships?.map((clubMembership) => (
          <MenuItem
            key={clubMembership.id}
            value={`@${clubMembership.group.slug}`}
          >
            {clubMembership.group.name}
          </MenuItem>
        ))}
      </SelectField>
      <Tooltip title={t('signature.template.help')}>
        <HelpOutlined />
      </Tooltip>
    </Stack>
  );
}
