import { SvgIcon, styled } from '@mui/material';

type BadgeIconProps = {
  Icon: typeof SvgIcon;
};

export function BadgeIcon({ Icon }: BadgeIconProps) {
  return (
    <IconContainer>
      <Icon htmlColor="white" fontSize="small" />
    </IconContainer>
  );
}

const IconContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  padding: '3px',
}));
