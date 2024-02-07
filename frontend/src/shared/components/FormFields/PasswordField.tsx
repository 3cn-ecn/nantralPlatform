import { memo, useState } from 'react';

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

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <TextField
      type={showPassword ? 'text' : 'password'}
      InputProps={{
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
            {showValidateIcon && <Check color="success" sx={{ margin: 0.5 }} />}
          </>
        ),
      }}
      {...props}
    />
    // <FormControl
    //   sx={sx}
    //   variant="outlined"
    //   error={!!errors}
    //   required={required}
    //   disabled={disabled}
    //   key={labelId}
    //   fullWidth={fullWidth}
    // >
    //   <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
    //   <OutlinedInput
    //     type={showPassword ? 'text' : 'password'}
    //     onChange={(val) => {
    //       handleChange(val.target.value);
    //     }}
    //     endAdornment={
    //       <>
    //         {visibilityIcon && (
    //           <InputAdornment position="end" sx={{ margin: 1 }}>
    //             <IconButton
    //               aria-label="toggle password visibility"
    //               onClick={handleClickShowPassword}
    //               onMouseDown={handleMouseDownPassword}
    //               edge="end"
    //             >
    //               {showPassword ? <VisibilityOff /> : <Visibility />}
    //             </IconButton>
    //           </InputAdornment>
    //         )}
    //         {validatePassword && <Check color="success" sx={{ margin: 0.5 }} />}
    //       </>
    //     }
    //     label={label}
    //     {...props}
    //   />
    //   <FormHelperText>
    //     {isError ? errors.map((err) => <p key={err}>{err}</p>) : helperText}
    //   </FormHelperText>
    // </FormControl>
  );
}

export const PasswordField = memo(
  PasswordFieldComponent,
) as typeof PasswordFieldComponent;
