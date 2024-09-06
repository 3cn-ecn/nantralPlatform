import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import { QueryClient } from '@tanstack/react-query';

import { PageTemplate } from '#shared/components/PageTemplate/PageTemplate';

import { groupDetailsLoader, groupListLoader } from './loader';

const LegalNoticePage = lazy(() => import('#pages/LegalNotice/Legal.page'));
const GroupPage = lazy(() => import('#pages/Group/Group.page'));
const GroupDetailsPage = lazy(
  () => import('#pages/GroupDetails/GroupDetails.page'),
);
const t = (key: string) => key;

export const publicRoutes: (queryClient: QueryClient) => RouteObject = (
  queryClient,
) => ({
  element: <PageTemplate />,
  children: [
    {
      path: '/legal-notice',
      element: <LegalNoticePage />,
      handle: { crumb: t('breadcrumbs.legal.index') },
    },
    {
      path: '/group',
      handle: { crumb: t('breadcrumbs.group.index') },
      children: [
        {
          loader: (args) => groupListLoader(args, queryClient),
          path: '',
          element: <GroupPage />,
        },
        {
          loader: (args) => groupDetailsLoader(args, queryClient),
          path: ':type',
          element: <GroupDetailsPage />,
        },
      ],
    },
  ],
});
