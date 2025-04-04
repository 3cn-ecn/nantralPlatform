import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EventDTO } from '#modules/event/infra/event.dto';
import { GroupPreviewDTO } from '#modules/group/infra/group.dto';
import { PostDTO } from '#modules/post/infra/post.dto';
import { mockServer } from '#shared/testing/mockServer';
import { renderWithProviders } from '#shared/testing/renderWithProviders';

import HomePage from './Home.page';

// mock ckeditor: replaced by #shared/ckeditor/__mocks__/CustomEditor.ts
jest.mock('#shared/ckeditor/CustomEditor.ts');

function mockPostApiCall(
  params: { pinned?: boolean; page?: number; page_size?: number },
  results: PostDTO[] = [],
) {
  mockServer
    .get('/api/post/post/')
    .query({ pinned: false, page: 1, page_size: 3, ...params })
    .reply(200, { count: results.length, results });
}

function mockEventApiCall(results: EventDTO[] = []) {
  mockServer
    .get('/api/event/event/')
    .query({
      from_date: /.*/,
      page: 1,
      page_size: /.*/,
    })
    .reply(200, { count: results.length, results });
}

function mockGroupApiCall(results: GroupPreviewDTO[]) {
  mockServer
    .get('/api/group/group/')
    .query({
      type: /.*/,
      is_member: true,
      is_admin: /.*/,
      slug: /.*/,
      search: /.*/,
      page: /.*/,
      page_size: /.*/,
      parent: /.*/,
    })
    .reply(200, { count: results.length, results });
}

describe('Home page', () => {
  it('should render correctly without data', async () => {
    // mock the api (since the backend does not exist during tests)
    mockEventApiCall([]);
    mockPostApiCall({ pinned: true }, []);
    mockPostApiCall({ pinned: false }, []);
    mockGroupApiCall([]);

    const component = renderWithProviders(<HomePage />);

    // At this point the page is still loading, so we use findBy and await
    // to wait for the element to appear.
    // We use findByRole to check that the element is a heading.
    // We use expect to make the test fails if the element is not found.
    expect(await screen.findByRole('heading', { name: 'Nantral Platform' }));

    // Now that the page is loaded, we check that the "Featured" section
    // (or "A la une" in French) is hidden, since we do not have any posts.
    expect(
      screen.queryByRole('heading', { name: 'Featured' }),
    ).not.toBeInTheDocument();

    // On the contrary, the Events section must be displayed
    expect(
      screen.queryByRole('heading', { name: 'Upcoming events' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/No upcoming event.../)).toBeInTheDocument();

    // finally, make a screenshot
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('navigates to the event page when clicking on the "See all" button', async () => {
    mockEventApiCall([]);
    mockPostApiCall({ pinned: true }, []);
    mockPostApiCall({ pinned: false }, []);
    mockGroupApiCall([]);

    // create a fake event page for testing
    const fakeEventRoute = { path: '/event', element: <p>Events</p> };

    renderWithProviders(<HomePage />, [fakeEventRoute]);

    // click the 'See all' button
    const seeAllLink = screen.getAllByText('See all')[0]; // NB: we use get because we are not in an expect
    userEvent.click(seeAllLink);

    // check that we are on the event page
    expect(await screen.findByText('Events')).toBeInTheDocument();
  });
});
