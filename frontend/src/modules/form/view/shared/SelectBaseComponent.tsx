import { useCallback, useMemo } from 'react';

import {
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';

import { LAYOUT_TYPES } from '#modules/form/constants';
import { useFormContext } from '#modules/form/hooks/useFormContext';
import { LanguageSelector } from '#shared/components/LanguageSelector/LanguageSelector';
import { useTranslation } from '#shared/i18n/useTranslation';

export function SelectBaseComponent() {
  const { t } = useTranslation();

  const { form, setForm, lang, setLang } = useFormContext();
  const layoutType = useMemo(
    () => form.nodes[form.root].payload.type,
    [form.nodes, form.root],
  );

  const setLayout = useCallback(
    (val: string) => {
      const input = LAYOUT_TYPES[val];
      if (!input) return;
      setForm({
        ...form,
        nodes: {
          [form.root]: {
            children: [],
            payload: {
              type: 'Control',
              translation: { fr: {}, en: {} },
              options: {},
              schema: {},
              ...input.defaultPayload,
            },
          },
        },
      });
    },
    [form, setForm],
  );

  const id = form.root + '/select_type';
  const selectLabel = t('jsonForm.edit.layoutSelect');

  return (
    <Stack direction={'row'} gap={2}>
      <FormControl fullWidth margin={'normal'}>
        <InputLabel id={id}>{selectLabel}</InputLabel>
        <Select
          variant={'outlined'}
          onChange={(e) => setLayout(e.target.value)}
          label={selectLabel}
          labelId={id}
          value={layoutType}
          renderValue={(val) => t(LAYOUT_TYPES[val].i18nKey)}
        >
          {Object.keys(LAYOUT_TYPES)
            .filter((type) =>
              [
                'Categorization',
                'Group',
                'HorizontalLayout',
                'VerticalLayout',
              ].includes(type),
            )
            .map((child) => (
              <MenuItem key={child} value={child}>
                <ListItemIcon>{LAYOUT_TYPES[child].icon}</ListItemIcon>
                <ListItemText primary={t(LAYOUT_TYPES[child].i18nKey)} />
              </MenuItem>
            ))}
        </Select>
        <FormHelperText>{t('jsonForm.edit.layoutSelectHelp')}</FormHelperText>
      </FormControl>
      <LanguageSelector
        selectedLang={lang}
        setSelectedLang={setLang}
        sx={{ justifySelf: 'center', alignSelf: 'center' }}
      />
    </Stack>
  );
}
