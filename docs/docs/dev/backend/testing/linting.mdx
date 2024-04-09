---
sidebar_position: 2
---

# Linter and Formatter

Enforces a consistent coding style across the project, and catches bugs before
they come.

## The Linter

Our linter is `Flake8`, a program which will raise errors if your code does not
respect the rules defined in the config.

To check all the backend code, run:

```bash
pipenv run lint
```

:::tip
The linter is automatically run when you save a file in VScode, if you have the
[Flake8 extension](https://marketplace.visualstudio.com/items?itemName=ms-python.flake8)
installed. It will show the errors directly in the editor.
:::

If you want to add an exception (for example when the linter raises an error
that is impossible to fix), you can ignore that error by adding a comment:

```python
my_variable = 1  # noqa: F001
```

Each error has a unique code, composed of a letter (which indicates which plugin
of Flake8 raised the error) and a number. You can
[find the list of all errors here](https://wemake-python-styleguide.readthedocs.io/en/latest/pages/usage/violations/index.html).

<details>
<summary>Where are the rules configured?</summary>

THe rules are configured in 2 places:

- the `.flake8` file, which is used by the **Flake8** VScode extension;
- the `pyproject.toml` file, which is used by the `pipenv run lint` command.

These 2 files contain the exact same rules, but in different formats. If you
want to add a new rule, you should add it in both files.

The reason for that difference is that the `pipenv run lint` command uses
**flakeheaven** instead of **flake8**, which is a wrapper of `flake8` which
ignores errors that were already present in the code before we use the linter.

</details>

## The Formatter

Our python formatter is `black`, a program which will automatically format your
code to respect the rules defined in the config. You can run it with:

```bash
pipenv run lint:fix
```

It will also run `isort` to sort the imports.

:::tip
The formatter is automatically run when you save a file in VScode, if you have
the [Black extension](https://marketplace.visualstudio.com/items?itemName=ms-python.black-formatter)
and [isort extension](https://marketplace.visualstudio.com/items?itemName=ms-python.isort)
installed.
:::
