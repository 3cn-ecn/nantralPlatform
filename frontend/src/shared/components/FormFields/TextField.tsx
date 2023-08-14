import { memo } from 'react';

import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from '@mui/material';

export type TextFieldProps = Omit<MuiTextFieldProps, 'onChange' | 'error'> & {
  handleChange: (value: string) => void;
  errors?: string[];
};

function TextFieldComponent({
  handleChange,
  errors,
  fullWidth = true,
  margin = 'normal',
  helperText,
  ...props
}: TextFieldProps) {
  const isError = errors !== undefined;

  return (
    <MuiTextField
      onChange={(e) => handleChange(e.target.value)}
      error={isError}
      helperText={isError ? errors.join(', ') : helperText}
      fullWidth={fullWidth}
      margin={margin}
      {...props}
    />
  );
}

export const TextField = memo(TextFieldComponent);
