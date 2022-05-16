---
title: Guidelines
description: "List of contribution guidelines"
published: true
date: 2022-05-07T22:56:59.475Z
editor: markdown
dateCreated: 2021-10-14T22:39:30.630Z
---

# Guidelines

**_Every major open-source project has its own style guide: a set of conventions (sometimes arbitrary) about how to write code for that project. It is much easier to understand a large codebase when all the code in it has a consistent style._**

## Git

- Write clear and concise commit messages describing your changes :
  - add Club model
  - reworked News model
- One feature or bug fix per branch. Always base a new branch from master. **Never base a branch on another branch.**

## Code formatting

### Python

- Use the [provided VSCode configuration](https://github.com/nantral-platform/nantralPlatform/blob/master/.vscode/settings-sample.json) to enforce a unified coding style.
- Add docstrings to every class based view, using the [autoDocstring extension](https://marketplace.visualstudio.com/items?itemName=njpwerner.autodocstring) for VSCode.
- Use the `.get()` method instead of simple `[]` to access dictionnaries' keys. See [this SO question](https://stackoverflow.com/questions/11041405/why-dict-getkey-instead-of-dictkey) as to why.
- Use the following naming convention (which follows the [PEP8](https://peps.python.org/pep-0008/) guidelines for Python):

<table class="table table-hover">
<thead>
<tr>
<th>Type</th>
<th>Naming Convention</th>
<th>Examples</th>
</tr>
</thead>
<tbody>
<tr>
<td>Function</td>
<td>Use a lowercase word or words. Separate words by underscores to improve readability.</td>
<td><code>function</code>, <code>my_function</code></td>
</tr>
<tr>
<td>Variable</td>
<td>Use a lowercase single letter, word, or words. Separate words with underscores to improve readability.</td>
<td><code>x</code>, <code>var</code>, <code>my_variable</code></td>
</tr>
<tr>
<td>Class</td>
<td>Start each word with a capital letter. Do not separate words with underscores. This style is called camel case.</td>
<td><code>Model</code>, <code>MyClass</code></td>
</tr>
<tr>
<td>Method</td>
<td>Use a lowercase word or words. Separate words with underscores to improve readability.</td>
<td><code>class_method</code>, <code>method</code></td>
</tr>
<tr>
<td>Constant</td>
<td>Use an uppercase single letter, word, or words. Separate words with underscores to improve readability.</td>
<td><code>CONSTANT</code>, <code>MY_CONSTANT</code>, <code>MY_LONG_CONSTANT</code></td>
</tr>
<tr>
<td>Module</td>
<td>Use a short, lowercase word or words. Separate words with underscores to improve readability.</td>
<td><code>module.py</code>, <code>my_module.py</code></td>
</tr>
<tr>
<td>Package</td>
<td>Use a short, lowercase word or words. Do not separate words with underscores.</td>
<td><code>package</code>, <code>mypackage</code></td>
</tr>
</tbody>
</table>

## Django

- Keep Django applications as small as possible.
- Every new feature has to be implemented in a new Django application. Fo instance, the club application should only be used to manage clubs. Furthermore, the news application, even though it's being used by clubs, should not be a function of clubs but a standalone app. This ensures atomicity and easy unittesting.
- When developping localy, do use a virtual environment.
- Write (at least) one unittest per Django view.
- Make sure to also test incorrect data inputs. For exemple you can test that no club manager can publish on another club's page.

## React

- Use TypeScript to its maximum. Every API call should expect a specific JSON format, and therefore a JavaScript object with a clear interface. Use [this website](https://quicktype.io/typescript) to convert JSON to a TypeScript interface.
- While React supports class based components, the future of React is functional, thus use functions as much as possible.
- Split components as much as possible.
- Keep one component per module. Use [clubsList](https://github.com/nantral-platform/nantralPlatform/blob/master/frontend/src/containers/clubsList.tsx) for reference.
- Only use axios when dealing with PUT, POST and DELETE. Use fetch otherwise (this results in smaller bundle sizes).
- Only use one UI framework at a time to reduce bundle size.
