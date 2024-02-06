import { useEffect, useState } from 'react';

import { isAuthenticatedApi } from '../api/isAuthenticated.api';
import { logoutApi } from '../api/logout.api';

export function useProvideAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    query();
  }, []);

  async function query() {
    setIsLoading(true);
    try {
      const res = await isAuthenticatedApi();
      setIsAuthenticated(res.status === 200);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    setIsLoading(true);
    await logoutApi();
    setIsAuthenticated(false);
    setIsLoading(false);
  }

  function login() {
    setIsAuthenticated(true);
  }
  return { isLoading, isAuthenticated: !!isAuthenticated, signOut, login };
}
