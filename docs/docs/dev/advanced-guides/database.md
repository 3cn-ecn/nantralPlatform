---
sidebar_position: 1
---

# Database

Some explanations about how the database is used in the project

## Simplified Conceptual Model

This schema presents the main entities ans associations of the project. It can be used as a reference for searching attributes name or tables name.

[![schema_bdd.svg](/schema_bdd_simplified.svg)](/schema_bdd_simplified.svg)

## Complete Physical Model

This model has been automaticly generated with the method described on this post: [medium.com/@yathomasi1/1-using-django-extensions-to-visualize-the-database-diagram-in-django-application-c5fa7e710e16](https://medium.com/@yathomasi1/1-using-django-extensions-to-visualize-the-database-diagram-in-django-application-c5fa7e710e16). It described all tables, included abstract ones which are only present in django (and not in the real sql database) and default ones of django framework.

:::info
If you have problems in running the method described above, you have to run before the other commands this command:
`sudo apt-get install libgraphviz-dev libpython3.7-dev`
:::

[![schema_bdd_complete.png](/schema_bdd_complete.png)](/schema_bdd_complete.png)
