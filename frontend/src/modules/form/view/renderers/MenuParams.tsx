import { useMemo } from 'react';

import { UUID } from 'crypto';
import { set } from 'lodash';

import { useFormContext } from '#modules/form/hooks/useFormContext';
import { TextFieldProps } from '#shared/components/FormFields';
import { NumberFieldProps } from '#shared/components/FormFields/NumberField';
import { NumberMenuItem } from '#shared/components/MenuForm/NumberMenuItem';
import { SelectableMenuItem } from '#shared/components/MenuForm/SelectableMenuItem';
import { TextMenuItem } from '#shared/components/MenuForm/TextMenuItem';
import { useTranslation } from '#shared/i18n/useTranslation';

type ParamProps<T = object> = Partial<T> & {
  id: UUID;
  title: string;
};

export function BooleanUiParm({ id, title }: ParamProps) {
  const { form, setPayload } = useFormContext();
  const node = useMemo(() => form.nodes[id], [form.nodes, id]);
  const { t } = useTranslation();

  return (
    <SelectableMenuItem
      label={t(`jsonForm.options.${title}.label`)}
      handleChange={(val) =>
        setPayload(id, set(node.payload, ['options', title], val))
      }
      selected={node.payload.options?.[title]}
    />
  );
}

export function BooleanParm({ id, title }: ParamProps) {
  const { form, setPayload } = useFormContext();
  const node = useMemo(() => form.nodes[id], [form.nodes, id]);
  const { t } = useTranslation();

  return (
    <SelectableMenuItem
      label={t(`jsonForm.options.${title}.label`)}
      handleChange={(val) =>
        setPayload(id, set(node.payload, ['schema', title], val))
      }
      selected={node.payload.schema?.[title]}
    />
  );
}

export function NumberUiParam({
  id,
  title,
  ...options
}: ParamProps<NumberFieldProps>) {
  const { form, setPayload } = useFormContext();
  const node = useMemo(() => form.nodes[id], [form.nodes, id]);
  const { t } = useTranslation();

  return (
    <NumberMenuItem
      label={t(`jsonForm.options.${title}.label`)}
      helperText={t(`jsonForm.options.${title}.helperText`)}
      handleChange={(val) =>
        setPayload(id, set(node.payload, ['options', title], val))
      }
      value={node.payload.options?.[title]}
      slotProps={{ input: options }}
    />
  );
}

export function NumberParam({
  id,
  title,
  ...options
}: ParamProps<NumberFieldProps>) {
  const { form, setPayload } = useFormContext();
  const node = useMemo(() => form.nodes[id], [form.nodes, id]);
  const { t } = useTranslation();

  return (
    <NumberMenuItem
      label={t(`jsonForm.options.${title}.label`)}
      helperText={t(`jsonForm.options.${title}.helperText`)}
      handleChange={(val) =>
        setPayload(id, set(node.payload, ['schema', title], val))
      }
      value={node.payload.schema?.[title]}
      slotProps={{ input: options }}
    />
  );
}

export function StringUiParam({
  id,
  title,
  ...options
}: ParamProps<TextFieldProps>) {
  const { form, setPayload } = useFormContext();
  const node = useMemo(() => form.nodes[id], [form.nodes, id]);
  const { t } = useTranslation();

  return (
    <TextMenuItem
      label={t(`jsonForm.options.${title}.label`)}
      helperText={t(`jsonForm.options.${title}.helperText`)}
      handleChange={(val) =>
        setPayload(id, set(node.payload, ['options', title], val))
      }
      value={node.payload.options?.[title]}
      slotProps={{ input: options }}
    />
  );
}

export function StringParam({
  id,
  title,
  ...options
}: ParamProps<TextFieldProps>) {
  const { form, setPayload } = useFormContext();
  const node = useMemo(() => form.nodes[id], [form.nodes, id]);
  const { t } = useTranslation();

  return (
    <TextMenuItem
      label={t(`jsonForm.options.${title}.label`)}
      helperText={t(`jsonForm.options.${title}.helperText`)}
      handleChange={(val) =>
        setPayload(id, set(node.payload, ['schema', title], val))
      }
      value={node.payload.schema?.[title]}
      slotProps={{ input: options }}
    />
  );
}
