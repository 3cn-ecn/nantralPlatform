# ---- Description ----
# This file generates the fixtures for the Account model.
# It generates 200 accounts with dummy data.
# Run it from the fixtures directory to generate fixtures.json, which is then
# used in the initial migrations.
# If changes are made to the required fields of the Accounts model, this
# file WILL HAVE TO BE EDITED accordingly.

import json
import copy
import names

studentTemp = {
    "is_superuser": False,
    "is_staff": False,
    "is_active": True,
}

L = []


def generate():
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
    with open('fixtures.json', 'w') as outfile:
        json.dump(L, outfile)


if __name__ == "__main__":
    generate()
