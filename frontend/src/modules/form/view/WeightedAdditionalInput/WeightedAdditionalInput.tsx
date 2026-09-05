import { useCallback, useMemo } from 'react';

import {
  Delete as DeleteIcon,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import { Button, IconButton, Typography } from '@mui/material';
import { UUID } from 'crypto';
import { set, unset } from 'lodash';

import { useFormContext } from '#modules/form/hooks/useFormContext';
import { FlexAuto, FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { TextField } from '#shared/components/FormFields';

export function WeightedAdditionalInput({ nodeId }: { nodeId: UUID }) {
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
      const: rowId,
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
      [...options, { const: optId }],
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
    (optId: string) => {
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
        options.filter((entry) => entry.const !== optId),
      );
      setPayload(nodeId, node.payload);
    },
    [node.payload, nodeId, options, setPayload],
  );

  return (
    <FlexAuto gap={1}>
      <FlexCol gap={1} width={'50%'}>
        <Typography variant={'h4'}>Rows</Typography>
        {rows?.map((rowId: UUID) => (
          <FlexRow key={rowId} gap={1} alignItems={'center'}>
            <RadioButtonUnchecked />
            <TextField
              handleChange={(val) => setLabel(rowId, val)}
              value={getLabel(rowId)}
              size={'small'}
              margin={'none'}
            />
            <IconButton onClick={() => handleRemoveRow(rowId)}>
              <DeleteIcon />
            </IconButton>
          </FlexRow>
        ))}
        <Button onClick={handleAddRow}>Add row</Button>
      </FlexCol>
      <FlexCol gap={1} width={'50%'}>
        <Typography variant={'h4'}>Columns</Typography>
        {options?.map(({ const: optId }) => (
          <FlexRow key={optId} gap={1} alignItems={'center'}>
            <RadioButtonUnchecked />
            <TextField
              handleChange={(val) => setLabel(optId, val)}
              value={getLabel(optId)}
              size={'small'}
              margin={'none'}
            />
            <IconButton onClick={() => handleRemoveOption(optId)}>
              <DeleteIcon />
            </IconButton>
          </FlexRow>
        ))}
        <Button onClick={handleAddOption}>Add column</Button>
      </FlexCol>
    </FlexAuto>
  );
}
