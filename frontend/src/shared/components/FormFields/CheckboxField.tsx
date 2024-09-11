import { ChangeEvent, memo } from 'react';

import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
  Typography,
} from '@mui/material';

type CheckboxFieldProps = Omit<
  FormControlLabelProps,
  'error' | 'onChange' | 'control' | 'label' | 'checked'
> & {
  label: string;
  value?: boolean;
  errors?: string[];
  helperText?: string;
  handleChange: (value: boolean) => void;
  checkboxProps?: CheckboxProps;
};

function CheckboxFieldComponent({
  label,
  value = false,
  handleChange,
  errors,
  helperText,
  checkboxProps = {},
  ...props
}: CheckboxFieldProps) {
  const isError = errors !== undefined;

  return (
    <FormControlLabel
      label={
        <>
          <Typography color={isError ? 'error' : undefined}>{label}</Typography>
          <FormHelperText sx={{ m: 0 }}>
            {isError ? errors.join(', ') : helperText}
          </FormHelperText>
        </>
      }
      checked={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        handleChange(e.target.checked)
      }
      value={value}
      control={<Checkbox {...checkboxProps} />}
      sx={{ ml: 0, ...props.sx }}
      {...props}
    />
  );
}

export const CheckboxField = memo(CheckboxFieldComponent);
