---
sidebar_position: 6
---

# Dependencies (npm)

_A little discussion about the nightmare of all developers..._

To manage our dependencies, we use [**npm**](https://www.npmjs.com/).
Npm is the package manager for JavaScript, and it's used to install and manage
the dependencies of a project.

## Concept

Npm is based on a file named `package.json`. This file is used to list the
dependencies needed for the project, and which versions of each package are
required. Then, npm will take this config to find all the dependencies and
sub-dependencies of each package, and try to find the latest version of each
package which is compatible with all the other packages. Once this problem is
solved, it will the list of all packages and their exact version into the
`package-lock.json` file.

## Add Dependencies

:::info
You can search for packages on the [npm website](https://www.npmjs.com/).
:::

Add a dependency (for example `date-fns`):

```bash
npm install date-fns
```

:::warning Bundle size
Be careful with the size of the packages you install. Each package installed
in the frontend will increase the size of the bundle, and so the loading time
of the website.

Always check the size of the package before installing it, for example using
[Bundlephobia](https://bundlephobia.com/).
:::

Add a dev dependency (i.e. a package used for testing only):

```bash
npm install --save-dev <package_name>
```

Remove a dependency:

```bash
npm uninstall <package_name>
```

:::note Semantic Versioning
Npm packages use [Semantic Versioning](https://docs.npmjs.com/about-semantic-versioning)
to indicate the version of a package.
:::

## Update Dependencies

After you edit the **package.json**, or when the last update was too old and you
need to update your packages, you have to update the **lock file** with the last
versions to correct security issues for example.

```bash
npm update
```

:::warning
This command will only update the **lock file**, but not always the
**package.json**: if you set an old version of a package in your package.json,
it will keep the old version to respect the package.json.
:::

## See outdated dependencies

Since the `update` command does not really update all the packages, we need
a command to see the outdated packages. The output of the command will tell
you if you can update directly a package with an `update` command, or if you
need to edit the config file before.

```bash
npm outdated
```

## Security issues

To see all the security issues:

```bash
npm audit
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
