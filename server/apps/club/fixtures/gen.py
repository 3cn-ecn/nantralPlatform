import json
import copy
clubtemp = {
    "model": "club.club",
    "pk": 3,
    "fields": {
        "name": "Club 1",
        "alt_name": "Le club 1",
        "logo": "",
        "banniere": "",
        "summary": "Ceci est le club 1",
        "description": "<p style=\"margin-left:10px;\">Raptim igitur properantes ut motus sui rumores celeritate nimia praevenirent, vigore corporum ac levitate confisi per flexuosas semitas ad summitates collium tardius evadebant. et cum superatis difficultatibus arduis ad supercilia venissent fluvii Melanis alti et verticosi, qui pro muro tuetur accolas circumfusus, augente nocte adulta terrorem quievere paulisper lucem opperientes. arbitrabantur enim nullo inpediente transgressi inopino adcursu adposita quaeque vastare, sed in cassum labores pertulere gravissimos.</p><p style=\"margin-left:10px;\">Superatis Tauri montis verticibus qui ad solis ortum sublimius attolluntur, Cilicia spatiis porrigitur late distentis dives bonis omnibus terra, eiusque lateri dextro adnexa Isauria, pari sorte uberi palmite viget et frugibus minutis, quam mediam navigabile flumen Calycadnus interscindit.</p><p style=\"margin-left:10px;\">Haec igitur prima lex amicitiae sanciatur, ut ab amicis honesta petamus, amicorum causa honesta faciamus, ne exspectemus quidem, dum rogemur; studium semper adsit, cunctatio absit; consilium vero dare audeamus libere. Plurimum in amicitia amicorum bene suadentium valeat auctoritas, eaque et adhibeatur ad monendum non modo aperte sed etiam acriter, si res postulabit, et adhibitae pareatur.</p>",
        "video1": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "video2": "https://www.youtube.com/watch?v=09m0B8RRiEE",
        "slug": "club-1",
        "modified_date": "2021-08-31T14:31:58.777Z",
        "bdx_type": 1,
        "email": "club1@nantral-platform.fr",
        "meeting_place": "Chez le/la prez du club 1",
        "meeting_hour": "Mardi à 10h"
    }
}
L = []
for i in range(1, 200):
    newClub = copy.deepcopy(clubtemp)
    newClub["pk"] = i+2
    newClub["fields"]["name"] = f'Club {i}'
    newClub["fields"]["alt_name"] = f'Le club {i}'
    newClub["fields"]["summary"] = f'Ceci est le club {i}'
    newClub["fields"]["slug"] = f'club-{i}'
    newClub["fields"]["slug"] = f'club{i}@nantral-platform.fr'
    newClub["fields"]["meeting_place"] = f'club{i}@nantral-platform.fr'
    newClub["fields"]["slug"] = f'Chez le/la prez du club {i}'
    L.append(newClub)
with open('./apps/club/fixtures/data.json', 'w') as outfile:
    json.dump(L, outfile)
