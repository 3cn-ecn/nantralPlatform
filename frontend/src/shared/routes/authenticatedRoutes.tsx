import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import { PageTemplate } from '#shared/components/PageTemplate/PageTemplate';

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
const NotFoundPage = lazy(() => import('#pages/NotFound/NotFound.page'));
const Signature = lazy(() => import('#pages/Signature/Signature.page'));

const t = (key: string) => key;

export const authenticatedRoutes: RouteObject = {
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
      path: '*',
      element: <NotFoundPage />,
      handle: { crumb: t('breadcrumbs.notFound.index') },
    },
  ],
};
