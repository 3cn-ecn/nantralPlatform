import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import { UnauthenticatedPageTemplate } from '#shared/components/PageTemplate/UnauthenticatedPageTemplate';

const ResetPasswordPage = lazy(
  () => import('#pages/ResetPassword/ResetPassword.page'),
);
const RegisterPage = lazy(() => import('#pages/Register/Register.page'));
const ForgotPasswordPage = lazy(
  () => import('#pages/ForgotPassword/ForgotPassword.page'),
);
const LoginPage = lazy(() => import('#pages/Login/Login.page'));

export const unauthenticatedRoutes: RouteObject = {
  element: <UnauthenticatedPageTemplate />,
  children: [
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/forgot_password', element: <ForgotPasswordPage /> },
    { path: '/reset_password/:token', element: <ResetPasswordPage /> },
  ],
};
