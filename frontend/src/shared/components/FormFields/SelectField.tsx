import { memo } from 'react';

import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  SelectProps,
} from '@mui/material';

type SelectFieldProps<ValueType extends string> = Omit<
  SelectProps<ValueType>,
  'error' | 'onChange'
> & {
  errors?: string[];
  helperText?: string;
  onChange: (value: string) => void;
};

function SelectFieldComponent<ValueType extends string>({
  label,
  onChange,
  errors,
  helperText,
  disabled,
  fullWidth = true,
  children,
  ...props
}: SelectFieldProps<ValueType>) {
  const labelId = `${label}-label`;
  const isError = errors !== undefined;

  return (
    <FormControl
      error={isError}
      disabled={disabled}
      fullWidth={fullWidth}
      margin="normal"
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      >
        {children}
      </Select>
      <FormHelperText>
        {isError ? errors.join(', ') : helperText}
      </FormHelperText>
    </FormControl>
  );
}

export const SelectField = memo(
  SelectFieldComponent
) as typeof SelectFieldComponent;
