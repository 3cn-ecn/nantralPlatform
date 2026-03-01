# spell-checker: words vect vecthasnan vectisnan ndarray
# ruff: noqa: N802, N803, N806, PLR0913

import logging
import random
import sys

import numpy as np
from matching.games import StableMarriage

from ..models import Family, MembershipFamily, QuestionMember
from ..utils import scholar_year

sys.setrecursionlimit(150000)
logger = logging.getLogger(__name__)


def vectisnan(vect: np.ndarray) -> bool:
    """Return True if all elements are NaN, else False."""
    return np.prod(np.isnan(vect)) == 1


def vecthasnan(vect: np.ndarray) -> bool:
    """Return True if the vect has a NaN, else False."""
    return np.sum(np.isnan(vect)) > 0


def get_question_list():
    """Get the questions as a list of dicts, with keys id, coeff
    and if there is an equivalent question for families, and then
    defines the NAN_VECT constant.
    """
    question_list = QuestionMember.objects.all().values(
        "id",
        "coeff",
        "equivalent",
        "code_name",
    )
    return question_list


def get_answer(member: MembershipFamily, question):
    """Get the answer and the coeff to a question for a member"""
    answers = [
        ans
        for ans in member.answermember_set.all()
        if ans.question.id == question["id"]
    ]

    if len(answers) == 1:
        # ordinary question case
        ans = {
            "answer": answers[0].answer,
            "coeff": answers[0].custom_coeff,
        }
        if member.role == "2A+" and question["equivalent"] is not None:
            # we check if we have to ponderate with a family question
            try:
                f_ans = next(
                    ans
                    for ans in member.group.answerfamily_set.all()
                    if ans.question.id == question["equivalent"]
                )

                f_ans_value = f_ans.answer
                f_ans_coeff = f_ans.custom_coeff

                quota = f_ans.question.quota / 100

                ans["answer"] = (1 - quota) * ans[
                    "answer"
                ] + quota * f_ans_value
                ans["coeff"] = (1 - quota) * ans["coeff"] + quota * f_ans_coeff

            except IndexError:
                raise Exception(
                    f"La famille {member.group} n'a pas répondu aux questions.",
                )
        return ans

    elif len(answers) == 0:
        # case of no answer to this question
        if member.role == "2A+" and question["equivalent"] is not None:
            # ordinary case : it is an only-family question (quota=100)
            # or if he didn't answer we take the family answer
            try:
                f_ans = next(
                    ans
                    for ans in member.group.answerfamily_set.all()
                    if ans.question.id == question["equivalent"]
                )
            except (IndexError, StopIteration):
                raise Exception(
                    f"La famille {member.group} n'a pas répondu aux questions.",
                )
            return {
                "answer": f_ans.answer,
                "coeff": f_ans.custom_coeff,
            }
        else:
            return {
                "answer": np.nan,
                "coeff": np.nan,
            }

    else:
        # bug case : a member must not have two answers for the same question
        raise Exception(
            f"User {member.user} has multiple answers for the {question.id} \
            question",
        )


def get_answers(member: MembershipFamily, question_list):
    """Get all the answers and coeff to the question_list for a member"""
    answers = []
    coeff = []
    for question in question_list:
        answer = get_answer(member, question)
        answers.append(answer["answer"])
        coeff.append(answer["coeff"])
    return np.array(answers), np.array(coeff)


def get_member_1A_list(question_list, itii=False):
    """Get the list of 1A students with their answers"""
    data = MembershipFamily.objects.filter(
        role="1A",
        group__isnull=True,
    ).prefetch_related(
        "answermember_set__question",
        "group__answerfamily_set__question",
    )
    if itii:
        data = data.filter(user__faculty="Iti")
    else:
        data = data.exclude(user__faculty="Iti")
    member_1A_list = []
    for membership in data:
        if len(membership.answermember_set.all()) >= len(question_list):
            answers, coeff = get_answers(membership, question_list)
            member_1A_list.append(
                {"member": membership, "answers": answers, "coeff": coeff}
            )
    return member_1A_list


def get_member_2A_list(question_list):
    """Get the list of 2A+ students with their answers"""
    # add all membershipFamily students
    data = MembershipFamily.objects.filter(
        role="2A+",
        group__year=scholar_year(),
    ).prefetch_related(
        "answermember_set__question",
        "group__answerfamily_set__question",
    )

    member2A_list = []
    for membership in data:
        answers, coeff = get_answers(membership, question_list)
        member2A_list.append(
            {
                "member": membership,
                "answers": answers,
                "coeff": coeff,
                "family": membership.group,
            }
        )

    # calculate the average answer for each family
    family_list = get_family_list(member2A_list)

    # fill the blank for members who do not responded with family answers
    for m in member2A_list:
        if vecthasnan(m["answers"]):
            # we search the family answers of this member
            fam_answers = next(
                f for f in family_list if f["family"] == m["family"]
            )["answers"]
            if vectisnan(m["answers"]):
                m["answers"] = fam_answers
            else:
                for i in range(m["answers"].size):
                    m["answers"][i] = fam_answers[i]

        if vecthasnan(m["coeff"]):
            # we search the family coeff of this member
            fam_answers = next(
                f for f in family_list if f["family"] == m["family"]
            )["coeff"]
            if vectisnan(m["coeff"]):
                m["coeff"] = fam_answers
            else:
                for i in range(m["coeff"].size):
                    m["coeff"][i] = fam_answers[i]

    # add the non_subscribed_members
    member2A_list += [
        {
            "member": m,
            "answers": f["answers"],
            "coeff": coeff,
            "family": f["family"],
        }
        for f in family_list
        if f["family"].non_subscribed_members
        for m in f["family"].non_subscribed_members.split(",")
    ]

    return member2A_list, family_list


def get_family_list(member2A_list):
    """Return a list of families with the average answer
    based of all his members who completed the form
    """
    family_list = []
    for fam in Family.objects.filter(year=scholar_year()):
        answers_list = np.array(
            [m["answers"] for m in member2A_list if m["family"] == fam],
        )
        answers_mean = np.nanmean(answers_list, axis=0)
        if np.isnan(answers_mean):
            raise Exception(f"Family {fam.name} has no members")
        if vectisnan(answers_mean):
            raise Exception(f"Members of {fam.name} have no answers")

        coeff_list = np.array(
            [m["coeff"] for m in member2A_list if m["family"] == fam],
        )
        coeff_mean = np.nanmean(coeff_list, axis=0)
        if np.isnan(coeff_mean):
            raise Exception(f"Family {fam.name} has no members")
        if vectisnan(coeff_mean):
            raise Exception(f"Members of {fam.name} have no answers")

        family_list.append(
            {
                "family": fam,
                "answers": answers_mean,
                "coeff": coeff_mean,
                "nb": fam.count_members_2A(),
            },
        )
    return family_list


def love_score(answers_a, coeff_list_a, answers_b, question_coeff_list):
    """Calculate the lovescore between two students.
    The score is not symetrical between member "a" and "b" : here it's from the point of view of "a"
    The lower the score is, the best it is.
    """

    global_coeff = coeff_list_a * question_coeff_list

    weighted_answers_a = answers_a * global_coeff
    weighted_answers_b = answers_b * global_coeff

    score = np.linalg.norm(weighted_answers_a - weighted_answers_b)

    if np.sum(1 - np.isnan(answers_a + answers_b)):
        # if each student has at least answered to one question
        return score
    else:
        # if one of the students has not answered to any question
        return np.inf


def make_same_length(member1A_list, member2A_list, family_list):
    """Add or delete 2A students so as to have the same number
    than 1A students
    """
    delta_len = len(member1A_list) - len(member2A_list)

    if delta_len > 0:  # more first year than second year
        # we add fake members in each family, one by one,
        # the more little first with the mean answer of the family
        family_list.sort(key=lambda f: f["nb"])
        i = 0
        n = len(family_list)
        while delta_len - i > 0:
            member2A_list.append(
                {
                    "member": f"Fake member {i}",
                    "answers": family_list[i % n]["answers"],
                    "coeff": family_list[i % n]["coeff"],
                    "family": family_list[i % n]["family"],
                },
            )
            i += 1

    elif delta_len < 0:  # more second year than first year
        # Remove random second year students, in big families first
        family_list.sort(key=lambda f: f["nb"], reverse=True)
        i = 0
        n = len(family_list)
        while delta_len + i < 0:
            index_members = [
                j
                for j in range(len(member2A_list))
                if member2A_list[j]["family"] == family_list[i % n]["family"]
            ]
            try:
                index = random.choice(index_members)
            except IndexError:
                raise Exception(
                    "Erreur : pas encore assez de 1A pour faire tourner l'algo.",
                )
            member2A_list = np.delete(member2A_list, index)
            i += 1

    return member2A_list


def prevent_lonelyness(
    member1A_list,
    member2A_list,
    family_list,
    q_id,
    q_val,
    q_name,
    question_coeff_list,
):
    """Empêcher de créer des familles avec des personnes seules du point de vue
    d'un critère : femmes, étudiants étrangers...
    """
    # on regarde pour chaque membre le critère
    for m in member1A_list:
        m[q_name] = m["answers"][q_id] == q_val
    for m in member2A_list:
        m[q_name] = m["answers"][q_id] == q_val
    # on compte le nombre de personnes avec ce critère par famille
    for f in family_list:
        f["nb_criteria_1A"] = len(
            [
                m
                for m in member1A_list
                if m[q_name] and m["family"] == f["family"]
            ],
        )
        f["nb_criteria_2A"] = len(
            [
                m
                for m in member2A_list
                if m[q_name] and m["family"] == f["family"]
            ],
        )
    # on cherche les familles avec une personne seule pour le critère
    for f in family_list:
        if f["nb_criteria_1A"] == 1 and f["nb_criteria_2A"] == 0:
            # on récupère le membre seul dans la famille et son id
            lonely_member_id = next(
                i
                for i in range(len(member1A_list))
                if (
                    member1A_list[i][q_name]
                    and member1A_list[i]["family"] == f["family"]
                )
            )
            lonely_member = member1A_list[lonely_member_id]
            # on sélectionne les membres dans une famille qui ont déjà un membre
            # avec ce critère où on peut rajouter le membre seul
            candidate_member_list = []
            for g in family_list:
                if g != f and (
                    g["nb_criteria_1A"] >= 1 or g["nb_criteria_2A"] >= 1
                ):
                    members = [
                        m
                        for m in member1A_list
                        if not m[q_name] and m["family"] == g["family"]
                    ]
                    candidate_member_list += members
            # si il y a des membres avec qui échanger
            if candidate_member_list:
                # on cherche le membre candidat avec le score le plus proche
                candidate_member = min(
                    candidate_member_list,
                    key=lambda m: love_score(
                        m["answers"],
                        m["coeff"],
                        lonely_member["answers"],
                        question_coeff_list,
                    ),
                )
                # on récupère l'index du candidat dans la liste member1A_list
                candidate_member_id = next(
                    i
                    for i in range(len(member1A_list))
                    if member1A_list[i] == candidate_member
                )
                candidate_family_id = next(
                    i
                    for i in range(len(family_list))
                    if family_list[i]["family"] == candidate_member["family"]
                )
                # on échange les familles
                member1A_list[lonely_member_id]["family"] = family_list[
                    candidate_family_id
                ]["family"]
                member1A_list[candidate_member_id]["family"] = f["family"]
                # on met à jour le nb de personnes avec critère dans ces
                # familles
                f["nb_criteria_1A"] -= 1
                family_list[candidate_family_id]["nb_criteria_1A"] += 1
    return member1A_list


def solve_problem(member_list1, member_list2, question_coeff_list):
    """Solve the matching problem"""
    # randomize lists in order to avoid unwanted effects
    logger.info("Randomize lists...")
    random.shuffle(member_list1)
    random.shuffle(member_list2)

    # creating the dicts
    logger.info("Creating the dicts for solving...")
    first_year_pref = {}
    second_year_pref = {}
    total_number = len(member_list1)  # total number of 1A or 2A (it's the same)

    for i in range(total_number):
        first_year_pref[i] = sorted(
            range(total_number),
            key=lambda n: love_score(
                member_list1[i]["answers"],
                member_list1[i]["coeff"],
                member_list2[n]["answers"],
                question_coeff_list,
            ),
        )
        second_year_pref[i] = sorted(
            range(total_number),
            key=lambda n: love_score(
                member_list2[i]["answers"],
                member_list2[i]["coeff"],
                member_list1[n]["answers"],
                question_coeff_list,
            ),
        )

    # make the marriage and solve the problem! Les 1A sont privilégiés dans
    # leurs préférences
    logger.info("Solving...")
    game = StableMarriage.create_from_dictionaries(
        first_year_pref,
        second_year_pref,
    )
    dict_solved = game.solve()

    # get the family for each 1A
    logger.info("Add families to 1A members")
    for player_1A, player_2A in dict_solved.items():
        id_1A = player_1A.name
        id_2A = player_2A.name
        member_list1[id_1A]["family"] = member_list2[id_2A]["family"]

    return member_list1


def save(member1A_list):
    """Save the families for 1A students in the database"""
    for member1A in member1A_list:
        member1A["member"].group = member1A["family"]
        member1A["member"].save()


def reset():
    """Reset the decision of the algorithm"""
    logger.info("Deleting...")
    members = MembershipFamily.objects.filter(
        role="1A",
        group__year=scholar_year(),
    )
    for m in members:
        m.group = None
        m.save()
    logger.info("Deleted!")
