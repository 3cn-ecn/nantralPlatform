import { LoaderFunctionArgs, redirect } from 'react-router-dom';

import { QueryClient } from '@tanstack/react-query';

import { getCurrentUserApi } from '#modules/account/api/getCurrentUser.api';
import { getUserDetailsApi } from '#modules/account/api/getUserDetails.api';
import { User } from '#modules/account/user.types';
import { getGroupDetailsApi } from '#modules/group/api/getGroupDetails.api';
import { getGroupTypeDetailsApi } from '#modules/group/api/getGroupTypeDetails.api';
import { Group } from '#modules/group/types/group.types';
import { GroupTypePreview } from '#modules/group/types/groupType.types';

export async function userDetailsLoader(
  { params }: LoaderFunctionArgs,
  queryClient: QueryClient,
) {
  const { id } = params;
  const currentUser =
    (queryClient.getQueryData(['user', 'current']) as User) ??
    (await queryClient.fetchQuery({
      queryFn: ({ signal }) => getCurrentUserApi({ signal }),
      queryKey: ['user', 'current'],
    }));

  if (id === 'me') {
    return redirect(`/student/${currentUser.id}`);
  }

  if (id === currentUser.id.toString()) {
    return {
      extraCrumb: {
        id: 'user me',
        label: currentUser.name,
        path: `/student/${currentUser.id}`,
      },
    };
  }

  const parsedId = id ? Number.parseInt(id) : undefined;

  if (!parsedId) {
    return redirect('/404');
  }

  const user =
    (queryClient.getQueryData(['user', parsedId]) as User) ??
    (await queryClient.fetchQuery({
      queryFn: () =>
        getUserDetailsApi({ id: parsedId }).catch(() => ({ id: -1 }) as User),
      queryKey: ['user', { id }],
    }));

  if (user.id === -1) {
    return redirect('/404');
  }

  return {
    extraCrumb: {
      id: `user ${user.id}`,
      label: user.name,
      path: user.url,
    },
  };
}

// load crumbs data
export async function groupListLoader(
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
export async function groupDetailsLoader(
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
