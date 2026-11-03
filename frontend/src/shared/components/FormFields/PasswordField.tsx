import { memo, useState, MouseEvent } from 'react';

import { Check, Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';

import { TextField, TextFieldProps } from './TextField';

interface PasswordFieldProps extends TextFieldProps {
  visibilityIconHidden?: boolean;
  showValidateIcon?: boolean;
}

function PasswordFieldComponent({
  visibilityIconHidden = false,
  showValidateIcon = false,
  ...props
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <TextField
      type={showPassword ? 'text' : 'password'}
      slotProps={{
        input: {
          endAdornment: (
            <>
              {!visibilityIconHidden && (
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
              {showValidateIcon && (
                <Check color="success" sx={{ margin: 0.5 }} />
              )}
            </>
          ),
        },
      }}
      {...props}
    />
  );
}

export const PasswordField = memo(
  PasswordFieldComponent,
) as typeof PasswordFieldComponent;
