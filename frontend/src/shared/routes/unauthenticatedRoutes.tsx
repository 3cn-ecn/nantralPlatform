import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import { UnauthenticatedPageTemplate } from '#shared/components/PageTemplate/UnauthenticatedPageTemplate';

const EmailSent = lazy(() => import('#pages/Register/components/EmailSent'));
const ForgotPasswordSuccessView = lazy(
  () => import('#pages/ForgotPassword/components/ForgotPasswordSuccessView'),
);
const RegisterChoice = lazy(
  () => import('#pages/Register/components/RegisterChoice'),
);
const RegisterFormPanel = lazy(
  () => import('#pages/Register/components/RegisterFormPanel'),
);
const ResetPasswordPage = lazy(
  () => import('#pages/ResetPassword/ResetPassword.page'),
);
const RegisterPage = lazy(() => import('#pages/Register/Register.page'));
const ForgotPasswordPage = lazy(
  () => import('#pages/ForgotPassword/ForgotPassword.page'),
);
const LoginPage = lazy(() => import('#pages/Login/Login.page'));
const ForgotPasswordForm = lazy(
  () => import('#pages/ForgotPassword/components/ForgotPasswordForm'),
);

export const unauthenticatedRoutes: RouteObject = {
  element: <UnauthenticatedPageTemplate />,
  children: [
    { path: '/login', element: <LoginPage /> },
    {
      path: '/register',
      element: <RegisterPage />,
      children: [
        { path: '', element: <RegisterChoice key="choice" />, id: 'choice' },
        { path: 'form', element: <RegisterFormPanel /> },
        { path: 'validation', element: <EmailSent /> },
      ],
    },
    {
      path: '/forgot_password',
      element: <ForgotPasswordPage />,
      children: [
        { path: '', element: <ForgotPasswordForm /> },
        { path: 'email_sent', element: <ForgotPasswordSuccessView /> },
      ],
    },
    { path: '/reset_password/:token', element: <ResetPasswordPage /> },
  ],
};
