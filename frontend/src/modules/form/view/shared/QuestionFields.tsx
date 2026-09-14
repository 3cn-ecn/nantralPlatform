import { useCallback, useMemo } from 'react';

import { JsonSchema } from '@jsonforms/core';
import { MoreHoriz } from '@mui/icons-material';
import {
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import { UUID } from 'crypto';
import { set } from 'lodash';

import { INPUT_TYPES } from '#modules/form/constants';
import { useFormContext } from '#modules/form/hooks/useFormContext';
import { SwitchField, TextField } from '#shared/components/FormFields';
import { IconMenu } from '#shared/components/IconMenu/IconMenu';
import { useTranslation } from '#shared/i18n/useTranslation';

/**
 * Function Component that handles fields for creating a form input
 */
export function QuestionFields({ nodeId }: { nodeId: UUID }) {
  const { form, lang, setForm, setPayload } = useFormContext();
  const node = form.nodes[nodeId];
  const { t } = useTranslation();

  const label = useMemo(
    () => node.payload.translation[lang].label ?? '',
    [lang, node.payload.translation],
  );
  const setLabel = useCallback(
    (val?: string) =>
      setForm(
        set(form, `nodes.${nodeId}.payload.translation.${lang}.label`, val),
      ),
    [setForm, form, nodeId, lang],
  );
  const type = useMemo(
    () => node.payload.schema['x-type'] ?? 'text',
    [node.payload.schema],
  );
  const setType = useCallback(
    (val: string) => {
      // transfer items list if available
      const transferredSchema = {};
      if (val === 'Multiple choice') {
        if (node.payload.schema.oneOf) {
          set(transferredSchema, 'items.oneOf', node.payload.schema.oneOf);
        }
      } else if (val === 'Enum') {
        if ((node.payload.schema.items as JsonSchema)?.oneOf) {
          set(
            transferredSchema,
            'oneOf',
            (node.payload.schema.items as JsonSchema).oneOf,
          );
        }
      }
      set(node.payload, 'schema', {
        ...INPUT_TYPES[val].defaultSchema,
        ...transferredSchema,
        'x-type': val,
      });
      set(node.payload, 'options', INPUT_TYPES[val].defaultOptions);
      setPayload(nodeId, node.payload);
    },
    [node.payload, nodeId, setPayload],
  );
  const description = useMemo(
    () => node.payload.translation[lang].description ?? '',
    [node.payload.translation, lang],
  );
  const setDescription = useCallback(
    (val?: string) =>
      setForm(
        set(
          form,
          `nodes.${nodeId}.payload.translation.${lang}.description`,
          val,
        ),
      ),
    [setForm, form, nodeId, lang],
  );
  const required = useMemo(
    () => node.payload.required,
    [node.payload.required],
  );
  const setRequired = useCallback(
    (val: boolean) => {
      return setPayload(nodeId, { ...node.payload, required: val });
    },
    [setPayload, nodeId, node.payload],
  );
  const input = useMemo(() => INPUT_TYPES[type], [type]);

  const selectTypeId = `select_type-${nodeId}`;

  return (
    <Stack gap={1}>
      <Stack direction={{ md: 'row' }} gap={1}>
        <TextField
          handleChange={setLabel}
          label={t('jsonForm.edit.question.label')}
          size={'medium'}
          value={label}
          margin={'none'}
        />
        <FormControl fullWidth margin={'none'}>
          <InputLabel id={selectTypeId}>
            {t('jsonForm.edit.question.typeSelect')}
          </InputLabel>
          <Select
            variant={'outlined'}
            onChange={(e) => setType(e.target.value)}
            label={t('jsonForm.edit.question.typeSelect')}
            labelId={selectTypeId}
            value={type}
            renderValue={(val) => t(INPUT_TYPES[val].i18nKey)}
          >
            {Object.entries(INPUT_TYPES).map(([key, input]) => (
              <MenuItem key={key} value={key}>
                <ListItemIcon>{input.icon}</ListItemIcon>
                <ListItemText primary={t(input.i18nKey)} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Stack direction={{ md: 'row' }} columnGap={2} alignItems={'center'}>
        <TextField
          handleChange={(val) => setDescription(val)}
          label={t('jsonForm.edit.question.description')}
          size={'small'}
          value={description?.[lang]}
          margin={'none'}
        />
        <SwitchField
          label={t('jsonForm.edit.question.required')}
          handleChange={setRequired}
          value={required}
        />
        {input.getOptions && (
          <IconMenu Icon={MoreHoriz} size={'medium'}>
            {input.getOptions(nodeId)}
          </IconMenu>
        )}
      </Stack>
      {input?.additionalInputs && <input.additionalInputs nodeId={nodeId} />}
    </Stack>
  );
}
