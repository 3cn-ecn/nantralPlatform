import { createContext, ReactNode, useContext } from 'react';

import {
  ProvideAuthValues,
  useProvideAuth,
} from '#modules/account/hooks/useProvideAuth';

const AuthContext = createContext<ProvideAuthValues>({
  isPending: true,
  isAuthenticated: false,
  logout: () => new Promise(() => null),
  login: () => new Promise(() => null),
  error: null,
});
/**
 * Auth Provider provides handy functions to access authentication state and modify it
 * with functions such as login and logout
 * @returns
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
/**
 * Get access to auth state
 * @returns
 */
export function useAuth() {
  return useContext(AuthContext);
}
