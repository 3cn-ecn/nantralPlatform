import { memo } from 'react';

import { TextField, TextFieldProps } from '@mui/material';

type CustomTextFieldProps = Omit<TextFieldProps, 'onChange' | 'error'> & {
  onChange: (value: string) => void;
  errors?: string[];
};

function CustomTextFieldComponent({
  onChange,
  errors,
  fullWidth = true,
  margin = 'normal',
  helperText,
  ...props
}: CustomTextFieldProps) {
  const isError = errors !== undefined;

  return (
    <TextField
      onChange={(e) => onChange(e.target.value)}
      error={isError}
      helperText={isError ? errors.join(', ') : helperText}
      fullWidth={fullWidth}
      margin={margin}
      {...props}
    />
  );
}

export const CustomTextField = memo(CustomTextFieldComponent);
