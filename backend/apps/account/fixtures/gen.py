# ---- Description ----
# This file generates the fixtures for the Account model.
# It generates 200 accounts with dummy data.
# Run it from the fixtures directory to generate fixtures.json, which is then
# used in the initial migrations.
# If changes are made to the required fields of the Accounts model, this
# file WILL HAVE TO BE EDITED accordingly.

import copy
import json

import names

STUDENT_TEMP = {
    "is_superuser": False,
    "is_staff": False,
    "is_active": True,
}

L = []


def generate():
    for i in range(1, 200):
        new_student = copy.deepcopy(STUDENT_TEMP)
        if i != 1:
            first_name = names.get_first_name().lower()
            last_name = names.get_last_name().lower()
            new_student["email"] = f"{first_name}.{last_name}@ec-nantes.fr"
        else:
            first_name = "robin"
            last_name = "test"
            new_student["is_superuser"] = True
            new_student["is_staff"] = True
            new_student["email"] = "robin@ec-nantes.fr"
        new_student["username"] = f"{first_name}{last_name}-{i}"
        new_student["first_name"] = f"{first_name}"
        new_student["last_name"] = f"{last_name}"

        L.append(new_student)
    with open("fixtures.json", "w") as outfile:
        json.dump(L, outfile)


if __name__ == "__main__":
    generate()
