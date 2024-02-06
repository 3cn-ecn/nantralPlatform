import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { PageTemplate } from '#shared/components/PageTemplate/PageTemplate';
import { UnauthenticatedPageTemplate } from '#shared/components/PageTemplate/UnauthenticatedPageTemplate';
import RequiresAuth from '#shared/components/RequireAuth/RequireAuth';
import { useTranslation } from '#shared/i18n/useTranslation';

const EventPage = lazy(() => import('#pages/Event/Event.page'));
const EventCalendarViewPage = lazy(
  () => import('#pages/Event/EventCalendar/EventCalendarView.page'),
);
const ResetPasswordPage = lazy(
  () => import('#pages/ResetPassword/ResetPassword.page'),
);
const RegisterPage = lazy(() => import('#pages/Register/Register.page'));
const EventGridViewPage = lazy(
  () => import('#pages/Event/EventGrid/EventGridView.page'),
);
const EventDetailsPage = lazy(
  () => import('#pages/EventDetails/EventDetails.page'),
);
const ForgotPasswordPage = lazy(
  () => import('#pages/ForgotPassword/ForgotPassword.page'),
);
const HomePage = lazy(() => import('#pages/Home/Home.page'));
const LegalNoticePage = lazy(() => import('#pages/LegalNotice/Legal.page'));
const NotFoundPage = lazy(() => import('#pages/NotFound/NotFound.page'));
const Signature = lazy(() => import('#pages/Signature/Signature.page'));
const Login = lazy(() => import('#pages/Login/Login.page'));
// create a fake t function so that vscode can show translations in editor
const t = (key: string) => key;

const authenticatedPages = {
  errorElement: <ErrorBoundary />,
  element: <PageTemplate />,
  children: [
    {
      path: '/',
      element: <HomePage />,
      handle: { crumb: t('breadcrumbs.home.index') },
    },
    {
      path: '/event',
      handle: { crumb: t('breadcrumbs.events.index') },
      children: [
        {
          element: <EventPage />,
          children: [
            {
              index: true,
              element: <EventGridViewPage />,
            },
            {
              path: 'calendar',
              element: <EventCalendarViewPage />,
              handle: {
                crumb: t('breadcrumbs.events.calendar.index'),
              },
            },
          ],
        },
        {
          path: ':id',
          element: <EventDetailsPage />,
          handle: { crumb: t('breadcrumbs.events.details.index') },
        },
      ],
    },
    {
      path: '/signature',
      element: <Signature />,
      handle: { crumb: t('breadcrumbs.signature.index') },
    },
    {
      path: '/legal-notice',
      element: <LegalNoticePage />,
      handle: { crumb: t('breadcrumbs.legal.index') },
    },
    {
      path: '*',
      element: <NotFoundPage />,
      handle: { crumb: t('breadcrumbs.notFound.index') },
    },
  ],
};

export const router = createBrowserRouter([
  {
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <UnauthenticatedPageTemplate />,
        children: [
          { path: '/login', element: <Login /> },
          { path: '/register', element: <RegisterPage /> },
          { path: '/forgot_password', element: <ForgotPasswordPage /> },
          { path: '/reset_password/:token', element: <ResetPasswordPage /> },
        ],
      },
      { element: <RequiresAuth />, children: [authenticatedPages] },
    ],
  },
]);

export function ErrorBoundary() {
  const { t } = useTranslation();

  return (
    <ErrorPageContent
      retryFn={() => window.location.reload()}
      message={t('error.unexpected')}
      reloadDocument
    />
  );
}
