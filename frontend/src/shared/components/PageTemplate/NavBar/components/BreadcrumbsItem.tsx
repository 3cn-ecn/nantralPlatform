import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { Button, Icon, Typography } from '@mui/material';

interface BreadcrumbsItemProps {
  path: string;
  label: string;
  icon?: string;
  fontWeight?: 'bold' | 'normal';
  minimized?: boolean;
}

export function BreadcrumbsItem({
  path,
  label,
  icon,
  fontWeight = 'normal',
  minimized = false,
}: BreadcrumbsItemProps) {
  const { pathname } = useLocation();
  const isCurrentPage = path.replace(/\/$/, '') === pathname.replace(/\/$/, '');

  const [, setParams] = useSearchParams();

  const scrollToTop = (e) => {
    e.preventDefault();
    setParams({});
    window.scroll({ behavior: 'smooth', top: 0 });
  };

  return (
    <Button
      component={Link}
      to={path}
      onClick={isCurrentPage ? scrollToTop : undefined}
      color="inherit"
      sx={{
        columnGap: 1,
        textTransform: 'none',
        minWidth: 'unset',
        borderRadius: '100px',
      }}
    >
      {icon && (
        <Icon
          component="img"
          src={icon}
          alt=""
          sx={{ width: 32, height: 32 }}
        />
      )}
      {!minimized && (
        <Typography
          variant="h6"
          component="span"
          fontWeight={fontWeight}
          noWrap
        >
          {label}
        </Typography>
      )}
    </Button>
  );
}
