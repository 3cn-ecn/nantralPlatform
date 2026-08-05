import { useCallback, useMemo } from 'react';

import { JsonSchema } from '@jsonforms/core';
import { MoreHoriz } from '@mui/icons-material';
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from '@mui/material';
import { UUID } from 'crypto';
import { remove, set } from 'lodash';
import { union } from 'lodash-es';

import { INPUT_TYPES } from '#modules/form/constants';
import { useFormContext } from '#modules/form/hooks/useFormContext';
import { FlexAuto, FlexCol } from '#shared/components/FlexBox/FlexBox';
import { TextField } from '#shared/components/FormFields';
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
  const required = useMemo(() => {
    if (node.parent === undefined) return true;
    const parent = form.nodes[node.parent];
    return parent.payload.options?.required?.includes(nodeId);
  }, [node.parent, form.nodes, nodeId]);
  const setRequired = useCallback(
    (val: boolean) => {
      if (node.parent === undefined) return;
      const parent = form.nodes[node.parent];
      let reqList: string[];
      if (val) {
        reqList = union(parent.payload.options?.required, [nodeId]);
      } else {
        reqList = remove(parent.payload.options?.required, nodeId);
      }
      return set(
        form,
        `nodes.${node.parent}.payload.options.required`,
        reqList,
      );
    },
    [form, nodeId, node.parent],
  );
  const input = useMemo(() => INPUT_TYPES[type], [type]);

  const selectTypeId = `select_type-${nodeId}`;

  return (
    <FlexCol gap={1}>
      <FlexAuto gap={1}>
        <TextField
          handleChange={setLabel}
          label={'Question'}
          size={'medium'}
          value={label}
          margin={'none'}
        />
        <FormControl fullWidth margin={'none'}>
          <InputLabel id={selectTypeId}>{'Select Input Type'}</InputLabel>
          <Select
            variant={'outlined'}
            onChange={(e) => setType(e.target.value)}
            label={'Select Input Type'}
            labelId={selectTypeId}
            value={type}
          >
            {Object.keys(INPUT_TYPES).map((key) => (
              <MenuItem key={key} value={key}>
                {t(`jsonForm.control.type.${key}.name`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FlexAuto>
      <FlexAuto columnGap={2} alignItems={'center'}>
        <TextField
          handleChange={(val) => setDescription(val)}
          label={'Description'}
          size={'small'}
          value={description?.[lang]}
          margin={'none'}
        />
        <FormControl margin={'none'}>
          <FormControlLabel
            label={'Requis'}
            value={required}
            control={<Switch onChange={(e) => setRequired(e.target.checked)} />}
          />
        </FormControl>
        {input.getOptions && (
          <IconMenu Icon={MoreHoriz} size={'medium'}>
            {input.getOptions(nodeId)}
          </IconMenu>
        )}
      </FlexAuto>
      {input?.additionalInputs && <input.additionalInputs nodeId={nodeId} />}
    </FlexCol>
  );
}
