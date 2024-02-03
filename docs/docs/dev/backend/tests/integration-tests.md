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

### On the back end

- on the whole back end:
  ```bash
  pipenv run test
  ```
- on a specific app of the backend:
  ```bash
  pipenv run test <path>
  ```
  where `<path>` is the path of the app, for example `apps.group`

## Write tests

### With django (on the back end)

- All tests should be written in a `tests.py` file, or in a `tests/` folder.
- You should test ideally all API routes, especially for the permissions.
