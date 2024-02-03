---
sidebar_position: 2
---

# Linting and Formatting

Enforces a consistent coding style across the project, and catches bugs before
they come.

## On the Back End

- Linter: [flake8](https://flake8.pycqa.org/), with the [wemake-python style-guide](https://wemake-python-styleguide.readthedocs.io/en/latest/pages/usage/violations/index.html)
  ```bash
  pipenv run lint
  ```
- Formatter: [black](https://black.readthedocs.io/) (for coding style)
  and [isort](https://pycqa.github.io/isort/) (for imports)
  ```bash
  pipenv run lint:fix
  ```

You can find the configuration of these tools in these 2 files (unfortunately
we have to duplicate the config for the moment):

- `.flake8` for the VScode extension of Flake8;
- `pyproject.toml` for the `pipenv run lint` command.

[See the list of all rules here](https://wemake-python-styleguide.readthedocs.io/en/latest/pages/usage/violations/index.html)

## On the CI

Did you noticed, that, on the back end, `pipenv run flake8` always returns a lot
of errors? That's because the legacy code, that was written before we adopted
the linter.

As a consequence, to make the tests pass in the CI, we use `flakeheaven` as a
wrapper of `flake8`. It allows us to save legacy errors in a
`.flakeheaven_baseline` file, and check only new errors.

However, this result in a duplicated config file, because `flakeaven` does not
support `.flake8` but only `pyproject.toml` file. In the future, the goal
is that all python tools use `pyproject.toml` as a config file, but `flake8`
does not support it yet...
