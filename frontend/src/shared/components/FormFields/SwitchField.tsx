import { ChangeEvent, memo } from 'react';

import {
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
  Switch,
  SwitchProps,
  Typography,
} from '@mui/material';

type SwitchFieldProps = Omit<
  FormControlLabelProps,
  'error' | 'onChange' | 'control' | 'label' | 'checked'
> & {
  label: string;
  value?: boolean;
  errors?: string[];
  helperText?: string;
  handleChange: (value: boolean) => void;
  switchProps?: SwitchProps;
};

function SwitchFieldComponent({
  label,
  value = false,
  handleChange,
  errors,
  helperText,
  switchProps = {},
  ...props
}: SwitchFieldProps) {
  const isError = errors !== undefined;

  return (
    <FormControlLabel
      label={
        <>
          <Typography color={isError ? 'error' : undefined}>{label}</Typography>
          <FormHelperText sx={{ m: 0 }} error={isError}>
            {isError ? errors.join(', ') : helperText}
          </FormHelperText>
        </>
      }
      checked={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        handleChange(e.target.checked)
      }
      value={value}
      control={<Switch {...switchProps} />}
      sx={{ ml: 0, ...props.sx }}
      {...props}
    />
  );
}

export const SwitchField = memo(SwitchFieldComponent);
