import { LoaderFunctionArgs, redirect } from 'react-router-dom';

import { QueryClient } from '@tanstack/react-query';

import { getGroupDetailsApi } from '#modules/group/api/getGroupDetails.api';
import { getGroupTypeDetailsApi } from '#modules/group/api/getGroupTypeDetails.api';
import { Group } from '#modules/group/types/group.types';
import { GroupTypePreview } from '#modules/group/types/groupType.types';
import { getCurrentUserApi } from '#modules/student/api/getCurrentUser.api';
import { getStudentDetailsApi } from '#modules/student/api/getStudentDetails.api';
import { Student } from '#modules/student/student.types';

export async function studentDetailsLoader(
  { params }: LoaderFunctionArgs,
  queryClient: QueryClient,
) {
  const { id } = params;
  const currentStudent =
    (queryClient.getQueryData(['student', 'current']) as Student) ??
    (await queryClient.fetchQuery({
      queryFn: ({ signal }) => getCurrentUserApi({ signal }),
      queryKey: ['student', 'current'],
    }));

  if (id === 'me') {
    return redirect(`/student/${currentStudent.id}`);
  }

  if (id === currentStudent.id.toString()) {
    return {
      extraCrumb: {
        id: 'student me',
        label: currentStudent.name,
        path: `/student/${currentStudent.id}`,
      },
    };
  }

  const parsedId = id ? Number.parseInt(id) : undefined;

  if (!parsedId) {
    return redirect('/404');
  }

  const student =
    (queryClient.getQueryData(['student', parsedId]) as Student) ??
    (await queryClient.fetchQuery({
      queryFn: () => getStudentDetailsApi({ id: parsedId }),
      queryKey: ['student', { id }],
    }));

  return {
    extraCrumb: {
      id: `student ${student.id}`,
      label: student.name,
      path: student.url,
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
