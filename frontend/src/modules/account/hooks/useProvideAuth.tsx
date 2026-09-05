import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { DjangoRestApiFieldValidationError } from '#shared/infra/errors';

import { isAuthenticatedApi } from '../api/isAuthenticated.api';
import { loginApi, LoginApiBody } from '../api/login.api';
import { logoutApi } from '../api/logout.api';

export interface ProvideAuthValues {
  isPending: boolean;
  isAuthenticated: boolean;
  error:
    | (AxiosError<{
        message?: string;
        code?: string;
        emails_ecn?: string[];
      }> & {
        fields?: DjangoRestApiFieldValidationError<LoginApiBody>;
      })
    | null;
  login: (body: LoginApiBody) => Promise<number>;
  logout: () => Promise<number>;
}

export function useProvideAuth(): ProvideAuthValues {
  const queryClient = useQueryClient();

  const { data: isAuthenticated, isPending } = useSuspenseQuery({
    queryFn: isAuthenticatedApi,
    queryKey: ['isAuthenticated'],
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnMount: false,
  });

  const { mutateAsync: logout, isPending: isLogoutPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess: async () => {
      queryClient.clear();
      queryClient.setQueryData(['isAuthenticated'], false);
    },
  });

  const {
    isPending: isLoginPending,
    mutateAsync: login,
    error,
  } = useMutation<
    number,
    AxiosError<{ message?: string; code?: string }>,
    LoginApiBody
  >({
    mutationFn: loginApi,
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(['isAuthenticated'], true);
    },
  });

  return {
    isPending: isPending || isLogoutPending || isLoginPending,
    isAuthenticated,
    logout,
    login,
    error,
  };
}
