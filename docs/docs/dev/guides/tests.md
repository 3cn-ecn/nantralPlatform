---
last_update:
  date: 2023-02-23 12:50:35 +0100
  author: Alexis Delage
sidebar_position: 7
---

# Tests

## Write tests

### With django (on the back end)

- All tests should be written in a `tests.py` file, or in a `tests/` folder.
- You should test ideally all API routes, especially for the permissions.

### With jest for React (on the front end)

- All tests should be written in files with the suffix `.test.ts` or `.test.tsx`.
- Do not test every component: only test _Pages_, and complex functions that can
  easily break.
- Test the user experience (like clicking a button should make this text appear,
  etc.). Refer to the guides for React of the _Testing Library_ project.

## Run tests

You can test your code globally by running in the `nantralPlatform` folder:

```bash
make test
```

### Run tests on the back end

- on the whole back end:
  ```bash
  pipenv run test
  ```
- on a specific app of the backend:
  ```bash
  pipenv run test <path>
  ```
  where `<path>` is the path of the app, for example `apps.group`

### Run unit tests on the front end

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
- update a snapshot
  ```bash
  npm run jest:u <path>
  ```

### Run other tests on the front end

- Linting:
  ```bash
  npm run lint
  ```
- Typing:
  ```bash
  npm run types
  ```
