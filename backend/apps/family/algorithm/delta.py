# spell-checker: words dtype

import numpy as np

from ..models import MembershipFamily
from ..utils import scholar_year
from .utils import (
    get_member_1A_list,
    get_member_2A_list,
    get_question_list,
    love_score,
    save,
)


def delta_algorithm():
    """Attribute 1A members to families after the first algorithm"""
    # get the questionnary
    print("Get questions...")
    question_list = get_question_list()
    coeff_list = np.array([q["coeff"] for q in question_list], dtype=int)

    # get the members list with their answers for each question
    print("Get new 1A answers...")
    member1A_list = get_member_1A_list(question_list)
    print("Get 2A answers...")
    member2A_list, family_list = get_member_2A_list(question_list)

    # count number of members per family
    print("Calculate the deltas...")
    placed_1A = MembershipFamily.objects.filter(
        role="1A",
        group__year=scholar_year(),
    ).prefetch_related("group")
    for f in family_list:
        nb_1A = len(
            [m for m in placed_1A if m.group == f["family"]],
        )
        nb_2A = f["nb"]
        f["delta"] = nb_1A - nb_2A

    # pour chaque membre 1A non attribué, on lui cherche une famille
    print("Attributes a family to new 1As...")
    for m in member1A_list:
        # on prend les 20 premières familles où il manque encore des 1A et/ou
        # il y a peu de 1A en plus par rapport aux 2A, et si on a le même nombre
        # on tri par petites familles d'abord
        family_list.sort(key=lambda f: f["nb"])
        family_list.sort(key=lambda f: f["delta"])
        little_family_list = family_list[:20]

        # on cherche la meilleure famille
        m["family"] = min(
            little_family_list,
            key=lambda f: love_score(m["answers"], f["answers"], coeff_list),
        )["family"]

    print("Saving...")
    save(member1A_list)

    print("Done !")
    return member1A_list, member2A_list, family_list
