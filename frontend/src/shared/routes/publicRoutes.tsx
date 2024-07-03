import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import { PageTemplate } from '#shared/components/PageTemplate/PageTemplate';

const LegalNoticePage = lazy(() => import('#pages/LegalNotice/Legal.page'));
const GroupPage = lazy(() => import('#pages/Group/Group.page'));
const GroupDetailsPage = lazy(
  () => import('#pages/GroupDetails/GroupDetails.page'),
);
const t = (key: string) => key;

export const publicRoutes: RouteObject = {
  element: <PageTemplate />,
  children: [
    {
      path: '/legal-notice',
      element: <LegalNoticePage />,
      handle: { crumb: t('breadcrumbs.legal.index') },
    },
    {
      path: '/group',
      handle: { crumb: 'Groups' },
      children: [
        {
          path: '',
          element: <GroupPage />,
        },
        {
          path: ':type',
          element: <GroupDetailsPage />,
          handle: { crumb: 'Details' },
        },
      ],
    },
  ],
};
