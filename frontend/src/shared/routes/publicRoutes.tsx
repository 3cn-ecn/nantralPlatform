import { lazy } from 'react';
import { LoaderFunctionArgs, redirect, RouteObject } from 'react-router-dom';

import { QueryClient } from '@tanstack/react-query';

import { getGroupDetailsApi } from '#modules/group/api/getGroupDetails.api';
import { getGroupTypeDetailsApi } from '#modules/group/api/getGroupTypeDetails.api';
import { Group } from '#modules/group/types/group.types';
import { GroupTypePreview } from '#modules/group/types/groupType.types';
import { PageTemplate } from '#shared/components/PageTemplate/PageTemplate';

const LegalNoticePage = lazy(() => import('#pages/LegalNotice/Legal.page'));
const GroupPage = lazy(() => import('#pages/Group/Group.page'));
const GroupDetailsPage = lazy(
  () => import('#pages/GroupDetails/GroupDetails.page'),
);
const t = (key: string) => key;

// load crumbs data
async function groupListLoader(
  args: LoaderFunctionArgs<unknown>,
  queryClient: QueryClient,
) {
  const type = new URL(args.request.url).searchParams.get('type');
  if (!type) {
    return {};
  }

  try {
    const queryKey = ['groupType', type];
    const groupType: GroupTypePreview =
      queryClient.getQueryData(queryKey) ??
      (await queryClient.fetchQuery({
        queryFn: () => getGroupTypeDetailsApi(type),
        queryKey,
      }));

    return {
      extraCrumb: [
        {
          id: groupType.slug,
          label: groupType.name,
          path: args.request.url,
        },
      ],
    };
  } catch {
    return redirect('/group');
  }
}

// load crumbs data
async function groupDetailsLoader(
  args: LoaderFunctionArgs<unknown>,
  queryClient: QueryClient,
) {
  const type = args.params.type;
  if (!type) {
    return {};
  }
  try {
    const queryKey = ['group', { slug: type.slice(1) }];
    const group: Group =
      queryClient.getQueryData(queryKey) ??
      (await queryClient.fetchQuery({
        queryFn: async () => getGroupDetailsApi(type.slice(1)),
        queryKey,
      }));
    return {
      extraCrumb: [
        {
          id: group.groupType.slug,
          label: group.groupType.name,
          path: `/group/?type=${group.groupType.slug}`,
        },
        {
          id: group.id,
          label: group.shortName,
          path: group.url,
        },
      ],
    };
  } catch {
    return {};
  }
}

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
