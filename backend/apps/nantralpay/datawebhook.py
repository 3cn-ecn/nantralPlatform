# Stockage du JSON sous forme de chaîne
DATA = """
{
  "data": {
    "payer": {
      "email": "hadrien.guillaud69@gmail.com",
      "country": "FRA",
      "firstName": "Hadrien",
      "lastName": "Guillaud"
    },
    "items": [
      {
        "name": "TEST",
        "user": {
          "firstName": "Hadrien",
          "lastName": "Guillaud"
        },
        "priceCategory": "Free",
        "customFields": [
          {
            "id": 4512847,
            "name": "Email utilisé sur NantralPlatform",
            "type": "TextInput",
            "answer": "hadrien.guillaud@ec-nantes.fr"
          }
        ],
        "ticketUrl": "https://www.helloasso.com/associations/association-des-etudiants-de-l-ecole-centrale-nantes/evenements/nantralpay/ticket?ticketId=98811081&ag=98811081",
        "qrCode": "OTg4MTEwODE6NjM4NTkwNjg1Nzk5MjA4Mjk2",
        "tierId": 12647258,
        "id": 98811081,
        "amount": 0,
        "type": "Registration",
        "initialAmount": 0,
        "state": "Processed"
      },
      {
        "name": "TEST",
        "user": {
          "firstName": "Hadrien",
          "lastName": "Guillaud"
        },
        "priceCategory": "Free",
        "customFields": [
          {
            "id": 4512847,
            "name": "Email utilisé sur NantralPlatform",
            "type": "TextInput",
            "answer": "admin@ec-nantes.fr"
          }
        ],
        "ticketUrl": "https://www.helloasso.com/associations/association-des-etudiants-de-l-ecole-centrale-nantes/evenements/nantralpay/ticket?ticketId=98811082&ag=98811081",
        "qrCode": "OTg4MTEwODI6NjM4NTkwNjg1Nzk5MjA4Mjk2",
        "tierId": 12647258,
        "id": 98811082,
        "amount": 100,
        "type": "Registration",
        "initialAmount": 0,
        "state": "Processed"
      }
    ],
    "amount": {
      "total": 0,
      "vat": 0,
      "discount": 0
    },
    "id": 98811081,
    "date": "2024-08-12T14:09:39.9208296+02:00",
    "formSlug": "nantralpay",
    "formType": "Event",
    "organizationName": "Association des Etudiants de l'Ecole Centrale Nantes",
    "organizationSlug": "association-des-etudiants-de-l-ecole-centrale-nantes",
    "organizationType": "Association1901Rig",
    "organizationIsUnderColucheLaw": false,
    "meta": {
      "createdAt": "2024-08-12T14:09:39.9208296+02:00",
      "updatedAt": "2024-08-12T14:09:40.1484043+02:00"
    },
    "isAnonymous": false,
    "isAmountHidden": false
  },
  "eventType": "Order"
}
"""
