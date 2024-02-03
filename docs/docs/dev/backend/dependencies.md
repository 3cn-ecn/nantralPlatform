---
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Manage dependencies

_A little discussion about the nightmare of all developers..._

To manage our dependencies, we will use a little program called a **package manager**:
it will try to find the best dependencies versions for each of our dependency
to avoid any issue and incompatibility between each library.

- `Pipenv`: a package manager for _Python_, used for the Django back end.
- `NPM`: a package manager for _Node.js_, used for the React front end and the documentation website.

## Generalities

For each package manager, there are two files:

- the config file (`Pipfile` for pipenv and `package.json` for npm);
- the lock file (`Pipfile.lock` for pipenv and `package-lock.json` for npm).

The config file is used to list the dependencies needed for the project,
and which versions of each package are required. Then, the package manager
will take this config to find all the dependencies and sub-dependencies of each
package, and try to find the latest version of each package which is compatible
with all the other packages. Once this problem is solved, it will the list of
all packages and their exact version into the lock file.

## Add Dependencies

<Tabs groupId="package-manager">
<TabItem value="pipenv" label="Pipenv">

Add a dependency:

```bash
pipenv install <package_name>
```

Add a dev dependency (i.e. a package used for devs only):

```bash
pipenv install --dev <package_name>
```

Remove a dependency:

```bash
pipenv uninstall <package_name>
```

</TabItem>
<TabItem value="npm" label="NPM">

Add a dependency:

```bash
npm install --save <package_name>
```

Add a dev dependency (i.e. a package used for devs only):

```bash
npm install --save-dev <package_name>
```

Remove a dependency:

```bash
npm uninstall <package_name>
```

</TabItem>
</Tabs>

:::danger
Always add the less number of dependencies possible! There are two reasons for this:

- The packages can be **not compatible** between each other
- For the React front end: the user will download all dependencies when he visits
  the website, so **less dependencies = faster navigation**!
  :::

## Update Dependencies

After you edit the **config file**, or when the last update was too old and you
need to update your packages, you have to update the **lock file** with the last
versions to correct security issues for example.

:::caution Warning
This command will only update the **lock file**, but not the **config file**:
if you set an old version of a package in your config
file, it will keep the old version to respect the config file.
:::

<Tabs groupId="package-manager">
<TabItem value="pipenv" label="Pipenv">

```bash
pipenv update --dev
```

</TabItem>
<TabItem value="npm" label="NPM">

```bash
npm update
```

</TabItem>
</Tabs>

## See outdated dependencies

Since the `update` command does not really update all the packages, we need
a command to see the outdated packages. The output of the command will tell
you if you can update directly a package with an `update` command, or if you
need to edit the config file before.

<Tabs groupId="package-manager">
<TabItem value="pipenv" label="Pipenv">

```bash
pipenv update --outdated
```

</TabItem>
<TabItem value="npm" label="NPM">

```bash
npm outdated
```

</TabItem>
</Tabs>

## Security issues

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

<Tabs groupId="package-manager">
<TabItem value="pipenv" label="Pipenv">

To see all the security issues:

```bash
pipenv check
```

</TabItem>
<TabItem value="npm" label="NPM">

To see all the security issues:

```bash
npm audit
```

</TabItem>
</Tabs>
