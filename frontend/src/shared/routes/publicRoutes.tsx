import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import { PageTemplate } from '#shared/components/PageTemplate/PageTemplate';

const LegalNoticePage = lazy(() => import('#pages/LegalNotice/Legal.page'));

const t = (key: string) => key;

export const publicRoutes: RouteObject = {
  element: <PageTemplate />,
  children: [
    {
      path: '/legal-notice',
      element: <LegalNoticePage />,
      handle: { crumb: t('breadcrumbs.legal.index') },
    },
  ],
};
