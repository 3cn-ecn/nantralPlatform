import { useCallback, useMemo } from 'react';

import { JsonSchema } from '@jsonforms/core';
import {
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Delete as DeleteIcon,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { UUID } from 'crypto';
import { without, set, unset } from 'lodash';

import { useFormContext } from '#modules/form/hooks/useFormContext';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { TextField } from '#shared/components/FormFields';

export function MultipleChoiceAdditionalInput({
  nodeId,
  multiple = false,
}: {
  nodeId: UUID;
  multiple?: boolean;
}) {
  const { form, lang, setPayload } = useFormContext();
  const node = form.nodes[nodeId];

  const options = useMemo(() => {
    if (multiple) {
      return (node.payload.schema.items as JsonSchema)?.enum || [];
    } else {
      return node.payload.schema.enum || [];
    }
  }, [multiple, node.payload.schema.enum, node.payload.schema.items]);

  const getLabel = useCallback(
    (optId: UUID) => node.payload.translation[lang][optId] ?? '',
    [lang, node.payload.translation],
  );
  const setlabel = useCallback(
    (optId: UUID, val?: string) =>
      setPayload(
        nodeId,
        set(node.payload, `translation.${lang}.${optId}`, val),
      ),
    [setPayload, nodeId, node.payload, lang],
  );

  const handleAddOption = useCallback(() => {
    const optId = crypto.randomUUID();
    // add option to the enum
    if (multiple) {
      set(node.payload, 'schema.items.enum', [...options, optId]);
    } else {
      set(node.payload, 'schema.enum', [...options, optId]);
    }
    // initialize translations
    // set(node.payload, `translation.fr.${optId}`, 'Option');
    // set(node.payload, `translation.en.${optId}`, 'Option');
    setPayload(nodeId, node.payload);
  }, [multiple, node.payload, setPayload, nodeId, options]);

  const handleRemoveOption = useCallback(
    (optId: string) => {
      // Reset translations
      unset(node.payload, `translation.fr.${optId}`);
      unset(node.payload, `translation.en.${optId}`);
      // Remove option from the enum
      if (multiple) {
        set(node.payload, 'schema.items.enum', without(options, optId));
      } else {
        set(node.payload, 'schema.enum', without(options, optId));
      }
      setPayload(nodeId, node.payload);
    },
    [multiple, node.payload, nodeId, options, setPayload],
  );

  return (
    <FlexCol gap={1}>
      {options?.map((optId) => (
        <FlexRow key={optId} gap={1} alignItems={'center'}>
          {multiple ? <CheckBoxOutlineBlankIcon /> : <RadioButtonUnchecked />}
          <TextField
            handleChange={(val) => setlabel(optId, val)}
            value={getLabel(optId)}
            size={'small'}
            margin={'none'}
          />
          <IconButton onClick={() => handleRemoveOption(optId)}>
            <DeleteIcon />
          </IconButton>
        </FlexRow>
      ))}
      <Button onClick={handleAddOption}>Add option</Button>
    </FlexCol>
  );
}
