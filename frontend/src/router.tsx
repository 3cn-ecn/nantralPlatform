import { createBrowserRouter } from 'react-router-dom';

import EventPage from '#pages/Event/Event.page';
import EventCalendarViewPage from '#pages/Event/EventCalendar/EventCalendarView.page';
import EventGridViewPage from '#pages/Event/EventGrid/EventGridView.page';
import EventDetailsPage from '#pages/EventDetails/EventDetails.page';
import HomePage from '#pages/Home/Home.page';
import LegalNoticePage from '#pages/LegalNotice/Legal.page';
import NotFoundPage from '#pages/NotFound/NotFound.page';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { useTranslation } from '#shared/i18n/useTranslation';

// create a fake t function so that vscode can show translations in editor
const t = (key: string) => key;

export const router = createBrowserRouter([
  {
    errorElement: <ErrorBoundary />,
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
