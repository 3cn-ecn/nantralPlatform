---
title: Test your code
sidebar_position: 2
---

# Test your code

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
    pipenv run test <app_name>
    ```
* on the front end:
    ```bash
    npm run test
    ```
