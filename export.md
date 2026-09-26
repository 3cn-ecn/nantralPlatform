# Export des inscrits au parrainage (JSON)

Aucun fichier du projet n'est modifié. Le code ci-dessous est à copier-coller
directement dans le shell Django interactif.

## Lancer le shell

Depuis `backend/` :

```bash
pipenv run python manage.py shell
```

## Coller ce code

```python
import json
from django.utils import timezone
from apps.family.models import MembershipFamily

ROLE_LABELS = {"1A": "EI1", "2A+": "EI2+"}
YEAR = timezone.now().year  # changer ici pour exporter une autre année, ex: 2025

memberships = (
    MembershipFamily.objects.filter(group__year=YEAR)
    .select_related("user", "user__email", "group")
    .order_by("user__last_name", "user__first_name")
)

data = []
for membership in memberships:
    user = membership.user
    family = membership.group
    data.append({
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email.email if user.email else None,
        "role": ROLE_LABELS.get(membership.role, membership.role),
        "family_id": family.id if family else None,
        "family_name": family.name if family else None,
    })

with open("/tmp/parrainage.json", "w") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"{len(data)} inscrits exportés dans /tmp/parrainage.json")
```

Le fichier `/tmp/parrainage.json` contient une liste d'objets avec pour
chaque inscrit :

- `username`
- `first_name`
- `last_name`
- `email`
- `role` : `"EI1"` (1ère année) ou `"EI2+"` (2ème année et plus)
- `family_id` : numéro de la famille (identifiant en base, `Family` n'a pas
  de champ "numéro" dédié)
- `family_name` : nom de la famille

Seules les personnes ayant effectivement rejoint une famille apparaissent
(le script parcourt les `MembershipFamily`, pas tous les `User`).

Quitter le shell avec `exit()` ou Ctrl+D une fois le fichier généré.

## Convertir en CSV

Toujours dans le même shell (ou un nouveau, peu importe — pas besoin de
Django pour cette étape), depuis un terminal classique :

```bash
python3 -c "
import json, csv
data = json.load(open('/tmp/parrainage.json'))
with open('/tmp/parrainage.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=data[0].keys())
    writer.writeheader()
    writer.writerows(data)
"
```

Ou avec `jq` :

```bash
jq -r '(["username","first_name","last_name","email","role","family_id","family_name"] | @csv),
       (.[] | [.username,.first_name,.last_name,.email,.role,.family_id,.family_name] | @csv)' \
  /tmp/parrainage.json > /tmp/parrainage.csv
```
