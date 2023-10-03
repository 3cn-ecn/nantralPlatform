import { useCallback, useMemo, useState } from 'react';

import { useTranslation } from '#shared/i18n/useTranslation';

import { TextField, TextFieldProps } from './TextField';

type NumberFieldProps = Omit<TextFieldProps, 'handleChange' | 'value'> & {
  value: number | null;
  handleChange: (value: number | null) => void;
  type?: 'numeric' | 'decimal';
};

export function NumberField({
  value,
  handleChange,
  type = 'numeric',
  errors,
  ...props
}: NumberFieldProps) {
  const [stringValue, setStringValue] = useState(value?.toString() || '');
  const { t } = useTranslation();

  const parseNumber = type === 'numeric' ? parseInt : parseFloat;

  const handleTextChange = useCallback(
    (val: string) => {
      val = val.replace(',', '.');
      setStringValue(val);
      if (val === '') {
        return handleChange(null);
      }
      if (isFinite(parseNumber(val))) {
        handleChange(parseNumber(val));
      }
    },
    [handleChange, parseNumber],
  );

  const allErrors = useMemo(
    () =>
      (value?.toString() || '') !== stringValue
        ? [t('form.number.wrongFormat'), ...(errors ?? [])]
        : errors,
    [errors, stringValue, t, value],
  );

  return (
    <TextField
      value={stringValue}
      handleChange={handleTextChange}
      errors={allErrors}
      type={type}
      {...props}
    />
  );
}
