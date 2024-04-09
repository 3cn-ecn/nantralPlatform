---
sidebar_position: 7
---

# Dependencies (Pipenv)

_A little discussion about the nightmare of all developers..._

To manage our dependencies, we use [**Pipenv**](https://pipenv.pypa.io/en/latest/).
Pipenv replaces 3 different things:

- `pip` for the installation of packages;
- `virtualenv` for the isolation of the environment;
- `requirements.txt` for the list of dependencies.

## Concept

Pipenv is based on a file named `Pipfile` and a lock file named `Pipfile.lock`.
The `Pipfile` is used to list the dependencies needed for the project,
and which versions of each package are required. Then, Pipenv will take this
config to find all the dependencies and sub-dependencies of each package, and
try to find the latest version of each package which is compatible with all the
other packages. Once this problem is solved, it will the list of all packages
and their exact version into the lock file.

## Add Dependencies

:::info
You can search for packages on the [Python Package Index](https://pypi.org/).
:::

Add a dependency (for example `numpy`):

```bash
pipenv install numpy~=1.20
```

Add a dev dependency (i.e. a package used for testing only):

```bash
pipenv install --dev <package_name>
```

Remove a dependency:

```bash
pipenv uninstall <package_name>
```

:::warning Semantic Versioning
Always indicate the version when adding a package to your project.
By default, Pipenv will use `*` for the version in the `Pipfile`, which means
"any version". This is not a good practice, because you can't be sure that the
latest version of the package will be installed.

To indicate the version, it's better to use the `~=[major].[minor]` syntax
(and **not** the `~=[major].[minor].[patch]` syntax, with the 3rd number).
To know why, [check the docs](https://pipenv.pypa.io/en/latest/specifiers.html#specifying-versions-of-a-package).
:::

## Update Dependencies

After you edit the **Pipfile**, or when the last update was too old and you
need to update your packages, you have to update the **lock file** with the last
versions to correct security issues for example.

```bash
pipenv update --dev
```

:::warning
This command will only update the **lock file**, but not the **Pipfile**:
if you set an old version of a package in your Pipfile, it will keep the old
version to respect the Pipfile.
:::

## See outdated dependencies

Since the `update` command does not really update all the packages, we need
a command to see the outdated packages. The output of the command will tell
you if you can update directly a package with an `update` command, or if you
need to edit the config file before.

```bash
pipenv update --outdated
```

## Security issues

To see all the security issues:

```bash
pipenv check
```

Sometimes, one of your dependencies has a security issue. In this case,
you need to update it as soon as possible to prevent any security issue in your
project.

There are 3 cases:

1. **A patch has been released and you can update the package**: you're fine,
   just do the update!
2. **A patch has been released but you have other dependencies that use this
   package and they did not update yet**: wait a little bit that the parent
   package update its dependencies, and then see case n°1. If a package takes
   too much time to update its dependencies, then see n°3.
3. **No patch has been released**: you'll have a lot of work to do, sorry 😢
   You need to remove this dependency from your project, and try to find
   another one that can replace the package.
