---
sidebar_position: 3
---

# Integration Tests

Integration tests allows us to test the features of the code.

This is an important thing to do, to avoid regressions (if we add a new feature,
we should be sure that previous features still work).

## Philosophy

A good integration test is a test that reproduces the user experience.

For example, on the back end, we must have test that calls the API routes
and check that the returned objects are correct. We also have to test the
permissions and the error messages.

On the front end, integration tests should reproduce the user experience,
by simulating clicks on button, fill-in forms, etc., and watch the result.

## Run tests

### On the front end

- on the whole front end:
  ```bash
  npm run jest
  ```
- on a specific file
  ```bash
  npm run jest <path>
  ```
  where `<path>` is a regex, for example you can use `npm run jest Home` to run
  the file `Home.page.test.tsx`

## Write tests

### With jest for React (on the front end)

- All tests should be written in files with the suffix `.test.ts` or `.test.tsx`.
- Do not test every component: only test _Pages_, and complex functions that can
  easily break.
- Test the user experience (like clicking a button should make this text appear,
  etc.). Refer to the guides for React of the _Testing Library_ project.
- You can make snapshots if you think that's useful, but don't use too many of
  them. To update a snapshot, run:
  ```bash
  npm run jest:u <path>
  ```
