import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { isAuthenticatedApi } from '../api/isAuthenticated.api';
import { LoginApiBody, loginApi } from '../api/login.api';
import { logoutApi } from '../api/logout.api';

export interface ProvideAuthValues {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AxiosError<{ message?: string; code?: string }> | null;
  login: (body: LoginApiBody) => void;
  signOut: () => void;
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

  function setIsAuthenticated(value: boolean) {
    queryClient.setQueryData(['isAuthenticated'], value);
  }

  const logoutMutation = useMutation(logoutApi, {
    onSuccess: () => setIsAuthenticated(false),
  });

  async function signOut() {
    await logoutMutation.mutateAsync();
  }

  const loginMutation = useMutation<
    number,
    AxiosError<{ message?: string; code?: string }>,
    LoginApiBody
  >(loginApi, {
    onSuccess: () => setIsAuthenticated(true),
  });

  async function login(body: LoginApiBody) {
    await loginMutation.mutateAsync(body);
  }

  return {
    isLoading: isLoading || logoutMutation.isLoading || loginMutation.isLoading,
    isAuthenticated: !!isAuthenticated,
    signOut,
    login,
    error: loginMutation.error,
  };
}
