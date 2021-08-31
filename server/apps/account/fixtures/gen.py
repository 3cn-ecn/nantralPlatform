import json
import copy
import names
from django.conf import settings
settings.configure()
studentTemp = {
    "is_superuser": False,
    "is_staff": False,
    "is_active": True,
}

L = []
for i in range(1, 200):
    newStudent = copy.deepcopy(studentTemp)
    if i != 1:
        firstName = names.get_first_name().lower()
        lastName = names.get_last_name().lower()
        newStudent["email"] = f'{firstName}.{lastName}@ec-nantes.fr'
    else:
        firstName = "robin"
        lastName = "test"
        newStudent["is_superuser"] = True
        newStudent["is_staff"] = True
        newStudent["email"] = 'robin@ec-nantes.fr'
    newStudent["username"] = f'{firstName}{lastName}-{i}'
    newStudent["first_name"] = f'{firstName}'
    newStudent["last_name"] = f'{lastName}'

    L.append(newStudent)
with open('./apps/account/fixtures/data.json', 'w') as outfile:
    json.dump(L, outfile)
