import { useCallback, useMemo } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import ListIcon from '@mui/icons-material/List';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import { UUID } from 'crypto';
import { set, unset } from 'lodash';

import { useFormContext } from '#modules/form/hooks/useFormContext';
import { TextField } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';

export function WeightedAdditionalInput({ nodeId }: { nodeId: UUID }) {
  const { t } = useTranslation();

  const { form, lang, setPayload } = useFormContext();
  const node = form.nodes[nodeId];

  const rows = useMemo(
    () => Object.keys(node.payload.schema.allOf?.[0].properties || {}),
    [node.payload.schema.allOf],
  );
  const options = useMemo(
    () =>
      node.payload.schema.allOf?.[1].patternProperties?.['^.*$'].properties
        ?.value.oneOf || [],
    [node.payload.schema.allOf],
  );

  const getLabel = useCallback(
    (optId: UUID) =>
      (
        node.payload.translation[lang][optId] as
          | {
              label?: string;
              description?: string;
            }
          | undefined
      )?.label ?? '',
    [lang, node.payload.translation],
  );
  const setLabel = useCallback(
    (optId: UUID, val?: string) =>
      setPayload(
        nodeId,
        set(node.payload, `translation.${lang}.${optId}.label`, val),
      ),
    [setPayload, nodeId, node.payload, lang],
  );

  const handleAddRow = useCallback(() => {
    const rowId = crypto.randomUUID();
    // add row to the schema
    set(node.payload, ['schema', 'allOf', '0', 'properties', rowId], {
      i18n: rowId,
    });
    // initialize translations
    // set(node.payload, `translation.fr.${rowId}`, 'Ligne');
    // set(node.payload, `translation.en.${rowId}`, 'Row');
    setPayload(nodeId, node.payload);
  }, [node.payload, nodeId, setPayload]);
  const handleAddOption = useCallback(() => {
    const optId = crypto.randomUUID();
    // add option to the enum
    set(
      node.payload,
      [
        'schema',
        'allOf',
        '1',
        'patternProperties',
        '^.*$',
        'properties',
        'value',
        'oneOf',
      ],
      [...options, { title: optId, const: options.length }],
    );
    // initialize translations
    // set(node.payload, `translation.fr.${optId}`, 'Option');
    // set(node.payload, `translation.en.${optId}`, 'Option');
    setPayload(nodeId, node.payload);
  }, [node.payload, nodeId, options, setPayload]);

  const handleRemoveRow = useCallback(
    (rowId) => {
      // Reset translations
      unset(node.payload, `translation.fr.${rowId}`);
      unset(node.payload, `translation.en.${rowId}`);
      // Remove row from the schema
      unset(node.payload, ['schema', 'allOf', '0', 'properties', rowId]);
      setPayload(nodeId, node.payload);
    },
    [node.payload, nodeId, setPayload],
  );
  const handleRemoveOption = useCallback(
    (optId: string, optConst: number) => {
      // Reset translations
      unset(node.payload, `translation.fr.${optId}`);
      unset(node.payload, `translation.en.${optId}`);
      // Remove option from the schema
      set(
        node.payload,
        [
          'schema',
          'allOf',
          '1',
          'patternProperties',
          '^.*$',
          'properties',
          'value',
          'oneOf',
        ],
        options
          .filter((entry) => entry.const !== optConst)
          .map((opt, i) => ({ ...opt, const: i })),
      );
      setPayload(nodeId, node.payload);
    },
    [node.payload, nodeId, options, setPayload],
  );

  return (
    <Stack direction={{ md: 'row' }} gap={1}>
      <Stack gap={1} minWidth={'50%'}>
        <Typography variant={'h4'}>
          {t('jsonForm.edit.additionalInput.rows')}
        </Typography>
        {rows?.map((rowId: UUID) => (
          <Stack direction={'row'} key={rowId} gap={1} alignItems={'center'}>
            <ListIcon />
            <TextField
              handleChange={(val) => setLabel(rowId, val)}
              value={getLabel(rowId)}
              size={'small'}
              margin={'none'}
            />
            <IconButton
              aria-label={'delete option'}
              onClick={() => handleRemoveRow(rowId)}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
        <Button onClick={handleAddRow}>
          {t('jsonForm.edit.additionalInput.addRow')}
        </Button>
      </Stack>
      <Stack gap={1} minWidth={'50%'}>
        <Typography variant={'h4'}>
          {t('jsonForm.edit.additionalInput.columns')}
        </Typography>
        {options?.map(({ const: optConst, title: optId }) => (
          <Stack direction={'row'} key={optId} gap={1} alignItems={'center'}>
            <RadioButtonUncheckedIcon />
            <TextField
              handleChange={(val) => setLabel(optId, val)}
              value={getLabel(optId)}
              size={'small'}
              margin={'none'}
            />
            <IconButton
              aria-label={'delete option'}
              onClick={() => handleRemoveOption(optId, optConst)}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
        <Button onClick={handleAddOption}>
          {t('jsonForm.edit.additionalInput.addColumn')}
        </Button>
      </Stack>
    </Stack>
  );
}
