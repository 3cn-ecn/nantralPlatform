import { useCallback, useMemo } from 'react';

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

import { LAYOUT_TYPES } from '#modules/form/constants';
import { useFormContext } from '#modules/form/hooks/useFormContext';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { LanguageSelector } from '#shared/components/LanguageSelector/LanguageSelector';

export function SelectBaseComponent() {
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
  const selectLabel = 'Select the type';

  return (
    <FlexRow gap={2}>
      <FormControl fullWidth margin={'normal'}>
        <InputLabel id={id}>{selectLabel}</InputLabel>
        <Select
          variant={'outlined'}
          onChange={(e) => setLayout(e.target.value)}
          label={selectLabel}
          labelId={id}
          value={layoutType}
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
                {LAYOUT_TYPES[child].type}
              </MenuItem>
            ))}
        </Select>
        <FormHelperText>
          Choisissez le type d&#39;élément que vous souhaitez ajouter
        </FormHelperText>
      </FormControl>
      <LanguageSelector
        selectedLang={lang}
        setSelectedLang={setLang}
        sx={{ justifySelf: 'center', alignSelf: 'center' }}
      />
    </FlexRow>
  );
}
