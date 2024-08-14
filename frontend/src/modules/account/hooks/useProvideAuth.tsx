import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { isAuthenticatedApi } from '../api/isAuthenticated.api';
import { LoginApiBody, loginApi } from '../api/login.api';
import { logoutApi } from '../api/logout.api';

export interface ProvideAuthValues {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AxiosError<{ message?: string; code?: string }> | null;
  login: (body: LoginApiBody) => Promise<number>;
  logout: () => Promise<number>;
}

export function useProvideAuth(): ProvideAuthValues {
  const queryClient = useQueryClient();

  const { data: isAuthenticated, isLoading } = useQuery({
    queryFn: isAuthenticatedApi,
    queryKey: ['isAuthenticated'],
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnMount: false,
    suspense: true,
  });

  const { mutateAsync: logout, isLoading: isLogoutLoading } = useMutation(
    logoutApi,
    {
      onSuccess: async () => {
        queryClient.clear();
        queryClient.setQueryData(['isAuthenticated'], false);
      },
    },
  );

  const {
    isLoading: isLoginLoading,
    mutateAsync: login,
    error,
  } = useMutation<
    number,
    AxiosError<{ message?: string; code?: string }>,
    LoginApiBody
  >(loginApi, {
    onSuccess: () => queryClient.setQueryData(['isAuthenticated'], true),
  });

  return {
    isLoading: isLoading || isLogoutLoading || isLoginLoading,
    isAuthenticated: !!isAuthenticated,
    logout,
    login,
    error,
  };
}
