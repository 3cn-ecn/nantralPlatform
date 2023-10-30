import { SignatureInfo } from '#modules/signature/signature.type';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { SelectField } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';
import { HelpOutline } from '@mui/icons-material';
import { MenuItem, Tooltip } from '@mui/material';
import { Dispatch, SetStateAction, useCallback } from 'react';

export type TemplateType = 'ecn' | 'international' | `@${string}`;

interface SelectTemplateProps {
  template: TemplateType;
  setTemplate: Dispatch<SetStateAction<string>>;
  clubMemberships?: SignatureInfo['clubMemberships'];
}

export function SelectTemplate({
  template,
  setTemplate,
  clubMemberships,
}: SelectTemplateProps) {
  const { t } = useTranslation();

  return (
    <FlexRow gap={2} alignItems="center">
      <SelectField
        label={t('signature.template.label')}
        value={template}
        handleChange={useCallback((value) => setTemplate(value), [setTemplate])}
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
        <HelpOutline />
      </Tooltip>
    </FlexRow>
  );
}
