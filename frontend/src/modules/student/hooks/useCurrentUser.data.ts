import { useQuery } from 'react-query';

import { ApiError } from '#shared/infra/errors';

import { getCurrentUserApi } from '../api/getCurrentUser.api';
import { Student } from '../student.types';

const emptyUser = {
  id: -1,
  name: 'Chargement...',
  promo: 1919,
  picture: '',
  faculty: '',
  path: '',
  url: '',
  staff: false,
};

export function useCurrentUserData() {
  const query = useQuery<Student, ApiError>({
    queryKey: ['student', 'current'],
    queryFn: ({ signal }) => getCurrentUserApi({ signal }),
  });

  if (query.isError)
    window.open(`/login?next=${window.location.pathname}`, '_self');

  return query.data || emptyUser;
}
