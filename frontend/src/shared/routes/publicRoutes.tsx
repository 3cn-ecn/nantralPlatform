import { lazy } from 'react';
import { LoaderFunctionArgs, redirect, RouteObject } from 'react-router-dom';

import { getGroupDetailsApi } from '#modules/group/api/getGroupDetails.api';
import { getGroupTypeDetailsApi } from '#modules/group/api/getGroupTypeDetails.api';
import { PageTemplate } from '#shared/components/PageTemplate/PageTemplate';

const LegalNoticePage = lazy(() => import('#pages/LegalNotice/Legal.page'));
const GroupPage = lazy(() => import('#pages/Group/Group.page'));
const GroupDetailsPage = lazy(
  () => import('#pages/GroupDetails/GroupDetails.page'),
);
const t = (key: string) => key;

async function groupTypeLoader(obj: LoaderFunctionArgs<unknown>) {
  const type = new URL(obj.request.url).searchParams.get('type');
  if (!type) {
    return {};
  }
  try {
    const groupType = await getGroupTypeDetailsApi(type);
    return {
      extraCrumb: [
        {
          id: groupType.slug,
          label: groupType.name,
          path: obj.request.url,
        },
      ],
    };
  } catch {
    return redirect('/group');
  }
}

async function groupDetailsLoader(obj: LoaderFunctionArgs<unknown>) {
  const type = obj.params.type;
  if (!type) {
    return {};
  }
  try {
    const group = await getGroupDetailsApi(type.slice(1));
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
      handle: { crumb: t('breadcrumbs.group.index') },
      children: [
        {
          loader: groupTypeLoader,
          path: '',
          element: <GroupPage />,
        },
        {
          loader: groupDetailsLoader,
          path: ':type',
          element: <GroupDetailsPage />,
        },
      ],
    },
  ],
};
