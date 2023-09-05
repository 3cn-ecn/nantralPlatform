# ---- Description ----
# This file generates the fixtures for the Event model.
# It generates 50 events with dummy data.
# Run it from the fixtures directory to generate fixtures.json, which is then
# used in the initial migrations.
# If changes are made to the required fields of the Event model, this
# file WILL HAVE TO BE EDITED accordingly.

import copy
import json
from random import random

EVENT_TEMP = {
    # spell-checker: disable
    "description": (
        '<p style="margin-left:10px;">Raptim igitur properantes ut motus sui '
        "rumores celeritate nimia praevenirent, vigore corporum ac levitate "
        "confisi per flexuosas semitas ad summitates collium tardius "
        "evadebant. et cum superatis difficultatibus arduis ad supercilia "
        "venissent fluvii Melanis alti et verticosi, qui pro muro tuetur "
        "accolas circumfusus, augente nocte adulta terrorem quievere paulisper "
        "lucem opperientes. arbitrabantur enim nullo inpediente transgressi "
        "inopino adcursu adposita quaeque vastare, sed in cassum labores "
        'pertulere gravissimos.</p><p style="margin-left:10px;">Superatis '
        "Tauri montis verticibus qui ad solis ortum sublimius attolluntur, "
        "Cilicia spatiis porrigitur late distentis dives bonis omnibus terra, "
        "eiusque lateri dextro adnexa Isauria, pari sorte uberi palmite viget "
        "et frugibus minutis, quam mediam navigabile flumen Calycadnus "
        'interscindit.</p><p style="margin-left:10px;">Haec igitur prima lex '
        "amicitiae sanciatur, ut ab amicis honesta petamus, amicorum causa "
        "honesta faciamus, ne exspectemus quidem, dum rogemur; studium semper "
        "adsit, cunctatio absit; consilium vero dare audeamus libere. Plurimum "
        "in amicitia amicorum bene suadentium valeat auctoritas, eaque et "
        "adhibeatur ad monendum non modo aperte sed etiam acriter, si res "
        "postulabit, et adhibitae pareatur.</p>"
    ),
    # spell-checker: enable
    "location": "Chez le/la président⋅e",
}


L = []


def generate():
    for i in range(1, 15):
        new_event = copy.deepcopy(EVENT_TEMP)
        new_event["title"] = f"Event {i}"
        new_event["location"] = f"Chez le/la président⋅e du club {i}"
        new_event["publicity"] = "Pub" if random() > 0.2 else "Mem"
        L.append(new_event)
    with open("fixtures.json", "w") as outfile:
        json.dump(L, outfile)


if __name__ == "__main__":
    generate()
