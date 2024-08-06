# spell-checker: words dtype,
# ruff: noqa: N806

import logging

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

logger = logging.getLogger(__name__)


def main_algorithm():
    # get the questionnary
    logger.info("Get questions...")
    question_list = get_question_list()
    coeff_list = np.array([q["coeff"] for q in question_list], dtype=int)

    # get the members list with their answers for each question
    logger.info("Get 1A answers...")
    member1A_list = get_member_1A_list(question_list)
    logger.info("Get 2A answers...")
    member2A_list, family_list = get_member_2A_list(question_list)

    # Add or delete 2A members so as to have the same length as 1A members
    logger.info("Checking the length...")
    new_member1A_list, new_member2A_list, surplus_member1A_list = (
        make_same_length(
            member1A_list,
            member2A_list,
            family_list,
        )
    )

    # Solve the matching problem
    member1A_list = solve_problem(
        new_member1A_list,
        new_member2A_list,
        surplus_member1A_list,
        coeff_list,
    )

    # prevent lonely foreign students
    logger.info("Checking that no international student is alone")
    question_id = next(
        i
        for i in range(len(question_list))
        if question_list[i]["code_name"] == "International"
    )
    question_value = 0
    member1A_list = prevent_lonelyness(
        member1A_list,
        member2A_list,
        family_list,
        question_id,
        question_value,
        "inter",
        coeff_list,
    )

    # prevent lonely girls
    logger.info("checking that no girl is alone")
    question_id = next(
        i
        for i in range(len(question_list))
        if question_list[i]["code_name"] == "Genre"
    )
    question_value = 1
    member1A_list = prevent_lonelyness(
        member1A_list,
        member2A_list,
        family_list,
        question_id,
        question_value,
        "genre",
        coeff_list,
    )

    # saving in database
    logger.info("Saving...")
    save(member1A_list)

    logger.info("Done!")
    return member1A_list, member2A_list, family_list
