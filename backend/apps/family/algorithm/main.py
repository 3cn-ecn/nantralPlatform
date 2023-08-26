# spell-checker: words dtype

import numpy as np

from .utils import (
    get_member_1A_list,
    get_member_2A_list,
    get_question_list,
    make_same_length,
    prevent_lonelyness,
    save,
    solve_problem,
)


def main_algorithm():
    # get the questionnary
    print("Get questions...")
    question_list = get_question_list()
    coeff_list = np.array([q["coeff"] for q in question_list], dtype=int)

    # get the members list with their answers for each question
    print("Get 1A answers...")
    member1A_list = get_member_1A_list(question_list)  # noqa: N806
    print("Get 2A answers...")
    member2A_list, family_list = get_member_2A_list(question_list)  # noqa: N806

    # Add or delete 2A members so as to have the same length as 1A members
    print("Checking the length...")
    member2A_list_plus = make_same_length(  # noqa: N806
        member1A_list, member2A_list, family_list
    )

    # Solve the matching problem
    member1A_list = solve_problem(  # noqa: N806
        member1A_list, member2A_list_plus, coeff_list
    )

    # prevent lonely foreign students
    print("Checking that no international student is alone")
    question_id = [
        i
        for i in range(len(question_list))
        if question_list[i]["code_name"] == "International"
    ][0]
    question_value = 0
    member1A_list = prevent_lonelyness(  # noqa: N806
        member1A_list,
        member2A_list,
        family_list,
        question_id,
        question_value,
        "inter",
        coeff_list,
    )

    # prevent lonely girls
    print("checking that no girl is alone")
    question_id = [
        i
        for i in range(len(question_list))
        if question_list[i]["code_name"] == "Genre"
    ][0]
    question_value = 1
    member1A_list = prevent_lonelyness(  # noqa: N806
        member1A_list,
        member2A_list,
        family_list,
        question_id,
        question_value,
        "genre",
        coeff_list,
    )

    # saving in database
    print("Saving...")
    save(member1A_list)

    print("Done!")
    return member1A_list, member2A_list, family_list
