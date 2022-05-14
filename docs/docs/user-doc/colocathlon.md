---
title: Colocathlon
description: "Présentation du fonctionnement de Nantral Platform pour le colocathlon"
published: true
date: 2021-10-30T13:55:13.774Z
editor: markdown
dateCreated: 2021-10-24T09:16:43.852Z
---

# Colocathlon

Chaque année, le BDE organise le colocathlon. L'idée est de permettre aux EI1 de visiter les colocations des EI2+ en faisant plusieurs activités diverses et variées.

L'organisation du colocathlon se déroule en 3 phases :

- **Phase 0 :** Pas de colocathlon
- **Phase 1 :** Chaque coloc indique si elle souhaite participer ou non au colocathlon
- **Phase 2 :** Les EI1 s'inscrivent sur une coloc pour le début de la soirée

> Ces 3 phases sont représentées par le paramètre `PHASE_COLOCATHLON`, modifiable via l'interface admin : https://nantral-platform.fr/admin/extra_settings/setting/
> {.is-info}

## Phase 1 : Inscription des colocs

_Cette phase ne s'affiche que si le paramètre `PHASE_COLOCATHLON` est défini à `1`._

Pendant la phase 1, les colocs sont invitées à indiquer leur choix de participer ou non au colocathlon. Pour se faire, un post facebook les invite à se connecter à Nantral Platform, puis à faire les étapes suivantes :

- se conecter à la carte des colocs
- aller sur la page de sa propre coloc ou la créer si elle n'existe pas

  > Astuce : pour aller plus vite, on peut partager le lien [www.nantral-platform.fr/my_coloc](https://nantral-platform.fr/my_coloc) qui redirige directement vers la page de la coloc de l'utilisateur connecté.
  > {.is-success}

- ce message s'affiche alors :
  ![colocathlon_1_details.png](/colocathlon_1_details.png)

- en cliquant sur le bouton, on peut alors remplir le formulaire suivant :
  ![colcoathlon_1_form.png](/colcoathlon_1_form.png)

> Point de vigilance : pour accéder au formulaire, il suffit d'être membre (et non admin comme c'est le cas pour les autres formulaires du site), donc n'importe qui peut modifier les données d'une autre coloc en s'ajoutant puis s'enlevant des membres.
> {.is-warning}

## Phase 2 : Inscription des EI1

_Cette phase ne s'affiche que si le paramètre `PHASE_COLOCATHLON` est défini à `2`._

- Pour commencer, les EI1 peuvent se connecter à la carte des colocs et activer le **"Mode Colocathlon"** pour ne voir que les colocs participantes au colocathlon. Les infobulles sur les colocs sont aussi modifiées afin d'afficher les heures d'ouvertures et les activités proposées. ![colocathlon_2_carte.png](/colocathlon_2_carte.png)
- Si une coloc les intéressent, les EI1 peuvent cliquer sur le bouton <kbd>Détails</kbd> dans l'infobulle pour accéder à la page de la coloc : ils peuvent alors voir le nombre de personnes déjà inscrites sur la coloc, le nombre maximal autorisé, et choisir si ils souhaitent s'y inscrire ou non.
  ![colcoathlon_2_details_ei1.png](/colcoathlon_2_details_ei1.png)
- Une fois le bouton cliqué, ils ont aussi toujours la possibilité de se désinscrire pour libérer leur place.
- Du côté des colocataires de la coloc, ils ont accès à la liste des particpants depuis la page de leur coloc (comme pour l'inscription, seuls les admins peuvent voir la liste).
