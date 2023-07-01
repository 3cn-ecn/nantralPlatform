import { memo } from 'react';

import { TextField, TextFieldProps } from '@mui/material';
import { isString } from 'lodash-es';

type TextFieldInputProps = Omit<TextFieldProps, 'onChange' | 'error'> & {
  onValueChange: (value: string) => void;
  isError?: boolean;
  errorMessage: string | string[];
};

function TextFieldInputComponent({
  onValueChange,
  isError,
  errorMessage,
  fullWidth = true,
  helperText,
  ...props
}: TextFieldInputProps) {
  const errorString =
    !!errorMessage &&
    (isString(errorMessage) ? errorMessage : errorMessage.join(', '));

  return (
    <TextField
      name="title"
      onChange={(e) => onValueChange(e.target.value)}
      error={isError}
      helperText={isError ? errorString : helperText}
      fullWidth={fullWidth}
      {...props}
    />
  );
}

export const TextFieldInput = memo(TextFieldInputComponent);
