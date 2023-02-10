---
sidebar_position: 2
---

# Staging server

Available at [dev.nantral-platform.fr](https://dev.nantral-platform.fr).

## 1. Purpose

The purpose of this staging server is to test modifications (and especially database modifications) before adding them to the main server. This is organised that way:

| Github branch | Address                                                    | Purpose                  |
| :------------ | :----------------------------------------------------------| :----------------------- |
| master        | [www.nantral-platform.fr](https://www.nantral-platform.fr) | The main site for users  |
| staging       | [dev.nantral-platform.fr](https://dev.nantral-platform.fr) | The dev site for testing |

## 2. How to test my code on the staging server

If you want to test your code on the staging server, you just have to create a pull request on Github, and select the branch `staging` instead of `master` to merge in.

Then github automatically deploys your code on the staging server, the same way it does for the main server.

Note that each time you deploy a new version on the staging server, the database of the staging server is deleted: it is replaced by a **copy** of the **database** from the main server. That way, you can test your modifications to check if your code is compatible with the main server database and will not erased some part of this database.

## 3. How to remove modifications on the staging server

Sometimes, you might want to remove the modifications you have pushed on the staging server (but not on the main server). You have two ways to do this:

1. Create new commits which revert your previous commits, and merge them on the staging branch
2. If you have way too much commits, you may prefer to reset the staging branch (see below).

### How to reset the staging branch (advanced)

You have to do it directly on the production server, so please be carefull!

- Connect to the server via `ssh`
- Go to the staging directory: `cd nantralPlatform-staging/`
- Update the master branch: `git checkout master` then `git pull`
- And then reset the staging branch on the server:
  - `git checkout staging` then
  - `git reset --hard master`

Then on your own computer:

- Update the master branch: `git checkout master` then `git pull`
- And then reset the staging branch again on your computer:
  - `git checkout staging` then
  - `git reset --hard master`
- Finally send the reset operation to the github repository: `git push --force`
- Then you can go to see the _Actions_ page on Github: it should redeploys automatically the staging server
