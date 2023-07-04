import { ChangeEvent, memo } from 'react';

import {
  Checkbox,
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
  onChange: (value: boolean) => void;
};

function CheckboxFieldComponent({
  label,
  value = false,
  onChange,
  errors,
  helperText,
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
        onChange(e.target.checked)
      }
      value={value}
      control={<Checkbox />}
      sx={{ ml: 0, ...props.sx }}
      {...props}
    />
  );
}

export const CheckboxField = memo(CheckboxFieldComponent);
