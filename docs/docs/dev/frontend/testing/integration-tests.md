---
sidebar_position: 3
---

# Integration Tests

Integration tests allows us to test the features of the code.

This is an important thing to do, to avoid regressions (if we add a new feature,
we should be sure that previous features still work).

:::info Why _Integration_ tests?

There are different types of tests:

- **Unit tests** are tests that test a single function or a single class.
- **Integration tests** are tests that test the interaction between different parts of the code.
- **End-to-end tests** are tests that test the whole application, from the front end to the back end.

On Nantral Platform, we choose to focus on integration tests, because they
are easy to implement and allow us to quickly find potential bugs or security
issues.

:::

## Philosophy

A good integration test is a test that reproduces the user experience.

For example, on the front end, we must have test that simulates clicks on button,
fill-in forms, etc., and watch the result.

## Write a test in the front end

To add a test for a page, create a `*.test.tsx` file next to the page you want to test.

Here is an example of a test file:

```tsx title="Home.page.test.tsx"
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EventDTO } from '#modules/event/infra/event.dto';
import { PostDTO } from '#modules/post/infra/post.dto';
import { mockServer } from '#shared/testing/mockServer';
import { renderWithProviders } from '#shared/testing/renderWithProviders';

import HomePage from './Home.page';

describe('Home page', () => {
  it('should render correctly without data', async () => {
    // mock the api (since the backend does not exist during tests)
    mockEventApiCall([]);
    mockPostApiCall({ pinned: true }, []);
    mockPostApiCall({ pinned: false }, []);

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

    // create a fake event page for testing
    const fakeEventRoute = { path: '/event', element: <p>Events</p> };

    renderWithProviders(<HomePage />, [fakeEventRoute]);

    // click the 'See all' button
    const seeAllLink = screen.getByText('See all'); // NB: we use get because we are not in an expect
    userEvent.click(seeAllLink);

    // check that we are on the event page
    expect(await screen.findByText('Events')).toBeInTheDocument();
  });
});

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
    .query({ from_date: /.*/, page: 1, page_size: /.*/ })
    .reply(200, { count: results.length, results });
}

// mock ckeditor: replaced by #shared/ckeditor/__mocks__/CustomEditor.ts
jest.mock('#shared/ckeditor/CustomEditor.ts');
```

:::tip Good practices

- Use the `mockServer` to mock the API calls.
- Use `renderWithProviders` to render the page with the providers.
- Use `screen` to query the elements.
- Use `userEvent` to simulate user events (click, type, etc.).

Check the docs for more info:
[Testing Library QuickStart](https://testing-library.com/docs/react-testing-library/example-intro),
[Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
and [user-event](https://testing-library.com/docs/ecosystem-user-event/).

:::

## Run the tests

You can run the tests of the whole front end with this command:

```bash
npm run jest
```

You can also run the tests for a specific file:

```bash
npm run jest <path>
```

where `<path>` is a regex, for example you can use `npm run jest Home` to run
the file `Home.page.test.tsx`.

## Update snapshots

Snapshots are like a screenshot of the rendered component. They are useful to
check that the component is rendered correctly, but they can be a bit heavy.

When you make changes to the interface, you might need to update the snapshots.
To do so, run:

```bash
npm run jest:u <path>
```

where `<path>` is the path to the file you want to update.
