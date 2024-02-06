import { memo, useState } from 'react';

import { Check, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
} from '@mui/material';

interface PasswordFieldProps extends OutlinedInputProps {
  errors?: string[];
  helperText?: string;
  handleChange: (value: string) => void;
  visibilityIcon?: boolean;
  validatePassword?: boolean;
}

function PasswordFieldComponent({
  label,
  handleChange,
  errors,
  helperText,
  disabled,
  fullWidth = true,
  visibilityIcon = true,
  required,
  validatePassword = false,
  sx,
  ...props
}: PasswordFieldProps) {
  const labelId = `${label}-label`;
  const isError = errors !== undefined;
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <FormControl
      sx={sx}
      variant="outlined"
      error={!!errors}
      required={required}
      disabled={disabled}
      key={labelId}
      fullWidth={fullWidth}
    >
      <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
      <OutlinedInput
        type={showPassword ? 'text' : 'password'}
        onChange={(val) => {
          handleChange(val.target.value);
        }}
        endAdornment={
          <>
            {visibilityIcon && (
              <InputAdornment position="end" sx={{ margin: 1 }}>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )}
            {validatePassword && <Check color="success" sx={{ margin: 0.5 }} />}
          </>
        }
        label={label}
        {...props}
      />
      <FormHelperText>
        {isError ? errors.map((err) => <p key={err}>{err}</p>) : helperText}
      </FormHelperText>
    </FormControl>
  );
}

export const PasswordField = memo(
  PasswordFieldComponent,
) as typeof PasswordFieldComponent;
