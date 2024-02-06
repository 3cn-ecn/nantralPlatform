import { ReactNode, createContext, useContext } from 'react';

import { useProvideAuth } from '#modules/account/hooks/useProvideAuth';

const authContext = createContext<{
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  login: () => void;
}>({
  isLoading: true,
  isAuthenticated: false,
  signOut: () => new Promise<void>(() => null),
  login: () => null,
});
/**
 * Auth Provider provides handy functions to access authentication state and modify it
 * with functions such as login and logout
 * @returns
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}
