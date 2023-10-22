import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { PageTemplate } from '#shared/components/PageTemplate/PageTemplate';
import { useTranslation } from '#shared/i18n/useTranslation';

const EventPage = lazy(() => import('#pages/Event/Event.page'));
const EventCalendarViewPage = lazy(
  () => import('#pages/Event/EventCalendar/EventCalendarView.page'),
);
const EventGridViewPage = lazy(
  () => import('#pages/Event/EventGrid/EventGridView.page'),
);
const EventDetailsPage = lazy(
  () => import('#pages/EventDetails/EventDetails.page'),
);
const HomePage = lazy(() => import('#pages/Home/Home.page'));
const LegalNoticePage = lazy(() => import('#pages/LegalNotice/Legal.page'));
const NotFoundPage = lazy(() => import('#pages/NotFound/NotFound.page'));
const Signature = lazy(() => import('#pages/Signature/Signature.page'));

// create a fake t function so that vscode can show translations in editor
const t = (key: string) => key;

export const router = createBrowserRouter([
  {
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
        path: '/tools/signature',
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
