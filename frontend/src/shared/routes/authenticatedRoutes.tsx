import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import { QueryClient } from '@tanstack/react-query';

import { PageTemplate } from '#shared/components/PageTemplate/PageTemplate';

import { studentDetailsLoader } from './loader';

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
const MapPage = lazy(() => import('#pages/Map/Map.page'));
const HomePage = lazy(() => import('#pages/Home/Home.page'));
const NotFoundPage = lazy(() => import('#pages/NotFound/NotFound.page'));
const Signature = lazy(() => import('#pages/Signature/Signature.page'));
const FeedbackHomePage = lazy(
  () => import('#pages/Feedback/FeedbackHome.page'),
);
const FeedbackFormPage = lazy(
  () => import('#pages/Feedback/FeedbackForm.page'),
);
const StudentListPage = lazy(
  () => import('#pages/StudentList/StudentList.page'),
);
const StudentDetailsPage = lazy(
  () => import('#pages/StudentDetails/StudentDetails.page'),
);

const t = (key: string) => key;

export const authenticatedRoutes: (queryClient: QueryClient) => RouteObject = (
  queryClient,
) => ({
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
      path: '/student',
      handle: { crumb: t('navbar.student') },
      children: [
        { index: true, element: <StudentListPage /> },
        {
          path: ':id',
          element: <StudentDetailsPage />,
          loader: (params) => studentDetailsLoader(params, queryClient),
        },
      ],
    },
    {
      path: '/feedback',
      handle: { crumb: t('breadcrumbs.feedback.home') },
      children: [
        {
          index: true,
          element: <FeedbackHomePage />,
        },
        {
          path: 'bug',
          element: <FeedbackFormPage kind="bug" />,
          handle: { crumb: t('breadcrumbs.feedback.bug') },
        },
        {
          path: 'suggestion',
          element: <FeedbackFormPage kind="suggestion" />,
          handle: { crumb: t('breadcrumbs.feedback.suggestion') },
        },
      ],
    },
    {
      path: '/map',
      element: <MapPage />,
      handle: { crumb: t('breadcrumbs.map.index') },
    },
    {
      path: '*',
      element: <NotFoundPage />,
      handle: { crumb: t('breadcrumbs.notFound.index') },
    },
  ],
});
