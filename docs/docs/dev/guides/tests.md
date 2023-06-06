---
last_update:
  date: 2023-02-23 12:50:35 +0100
  author: Alexis Delage
sidebar_position: 6
---

# Tests

You can test your code globally by running in the `nantralPlatform` folder:

```bash
make test
```

You can also run the tests:

* on the whole back end: 
    ```bash
    pipenv run test
    ```
* on a specific app of the backend:
    ```bash
    pipenv run test <path>
    ```
    where `<path>` is the path of the app, for example `apps.group`
* on the front end:
    ```bash
    npm run test
    ```
