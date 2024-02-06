import { Button, ButtonProps } from '@mui/material';

import './BigButton.scss';

export function BigButton({ sx, ...props }: ButtonProps) {
  return (
    <Button
      // className="big-button"
      sx={{
        width: '100%',
        borderRadius: '10px',
        padding: '15px 45px',
        margin: '0px 10px',
        backgroundImage: `linear-gradient(
          to right,
          #e43a15 0%,
          #e65245 51%,
          #e43a15 100%
        )`,
        backgroundSize: '200% auto',
        '&:hover': {
          filter: 'brightness(140%)',
          transition: '1',
        },
        ...sx,
      }}
      variant="contained"
      size="large"
      {...props}
    />
  );
}
