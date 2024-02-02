import { useMatches } from 'react-router-dom';

import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { Breadcrumbs } from '@mui/material';

import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';

import { BreadcrumbsItem } from './BreadcrumbsItem';

export function BreadcrumbsNav() {
  const matches = useMatches();
  const { t } = useTranslation();
  const bk = useBreakpoint('sm');

  // generate the list of all crumbs
  const crumbs = matches
    .filter((match) => (match.handle as { crumb?: string })?.crumb)
    .map((match) => ({
      id: match.id,
      label: t((match.handle as { crumb: string }).crumb),
      path: match.pathname,
    }));

  // select which crumbs to display: the last 3 for larger screens,
  // or the penultimate one for smaller screens (or the last one if 1 item only)
  const showedCrumbs = bk.isLarger
    ? crumbs.slice(-3)
    : crumbs.slice(crumbs.length > 1 ? -2 : -1).slice(0, 1);

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{
        // prevent wrapping
        overflow: 'hidden',
        '& ol': { flexWrap: 'nowrap' },
        // remove extra margins around separators
        '& li.MuiBreadcrumbs-separator': { margin: 0 },
      }}
    >
      <BreadcrumbsItem
        path="/"
        label={t('site.name')}
        icon="/static/img/logo/scalable/logo.svg"
        fontWeight="bold"
        minimized={bk.isSmaller && showedCrumbs.length > 0}
      />
      {showedCrumbs.map((crumb) => (
        <BreadcrumbsItem
          key={crumb.path}
          path={crumb.path}
          label={crumb.label}
        />
      ))}
    </Breadcrumbs>
  );
}
