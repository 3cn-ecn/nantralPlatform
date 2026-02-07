# ruff: noqa: N806

from datetime import datetime

from django.utils import timezone

import numpy as np
from extra_settings.models import Setting

from apps.account.models import User

from .models import Family, MembershipFamily, QuestionMember

FIRST_MONTH_OF_NEW_CYCLE = 6  # June


def scholar_year(date: datetime | None = None) -> int:
    """Calculate the current scholar year. The date of changement from one
    scholar year to another is fixed on the 1st June.

    Examples
    --------
    scholar_year(10 octobre 2021) => 2021
    scholar_year(25 february 2022) => 2021

    Parameters
    ----------
    date : datetime, optional
        A given date, by default today

    Returns
    -------
    int
        The scholar year corresponding to the given date

    """
    if date is None:
        date = timezone.now()
    year = date.year
    month = date.month
    if month < FIRST_MONTH_OF_NEW_CYCLE:
        year -= 1
    return year


def get_membership(
    user: User,
    year: int = scholar_year(),
) -> MembershipFamily | None:
    """Get the membership object which links the given user to a family,
    on a given year (one user can only have one family per year).

    Parameters
    ----------
    user : User
        The user associated with the wanted membership
    year : int, optional
        The year to filter on, by default the scholar year of today

    Returns
    -------
    MembershipFamily
        The membership object

    """
    try:
        member = user.membershipfamily_set.get(
            role="2A+",
            group__year=year,
        )
        return member
    except MembershipFamily.DoesNotExist:
        try:
            member = user.membershipfamily_set.get(
                role="1A",
            )
            return member
        except MembershipFamily.DoesNotExist:
            return None


def is_first_year(
    user: User,
    membership: MembershipFamily | None = None,
    year: int = scholar_year(),
) -> bool:
    """Determines if a user is in first year or not.
    If not, it means he/she is in second or third year.
    Use first the membership object to be sure, and fallback to the "promo"
    year of the user account if no membership exists.

    Parameters
    ----------
    user : User
        The user we want to know if he/she is in a first_year
    membership : MembershipFamily, optional
        The membership object to calculate faster, by default None
    year : int, optional
        The scholar year on which we want to know if the user is or was in first
        year, by default the scholar year of today.

    Returns
    -------
    bool
        True if user is in first year, false if in second or third year.

    """
    if not membership:
        membership = get_membership(user, year)  # try to get the membership
    if membership:
        return membership.role == "1A"

    promo = user.promo
    return promo == scholar_year()


def get_family(
    user: User,
    membership: MembershipFamily | None = None,
    year: int = scholar_year(),
) -> Family:
    """Get the family of a user for a certain year.

    Parameters
    ----------
    user : User
        The user we want to know his family
    membership : MembershipFamily, optional
        The membership object if we already know it, to calculate faster.
        Let it to None and the function will calculate it. By default None.
    year : int, optional
        The scholar year on which we want to know if the user is or was in first
        year, by default the scholar year of today.

    Returns
    -------
    Family
        The family object

    """
    if not membership:
        membership = get_membership(user, year)
    if membership:
        return membership.group
    return None


def show_sensible_data(
    user: User,
    membership: MembershipFamily | None = None,
) -> bool:
    """Decide if we must show or hide the sensible data of the families, that is
    to say their name, description, and members who are in 2nd or 3rd year.
    These infos must be hidden before and during the party when the first_year
    have to discover their mentors.

    Parameters
    ----------
    user : User
        The user to whom we will show the data
    membership : MembershipFamily, optional
        The membership object if existing, to calculate faster. By default None

    Returns
    -------
    bool
        True if we can display the sensible data, else False

    """
    if not membership:
        membership = get_membership(user)
    is_1A = is_first_year(user, membership)
    is_2A = not is_1A
    phase = Setting.get("PHASE_PARRAINAGE")
    if membership:
        # if membership exists, we are sure of the 1A/2A property
        return is_2A or (phase >= 4)  # noqa: PLR2004
    else:
        # here we are not sure of the 1A/2A property so we always hide,
        # except before the 1A have access to the form
        return phase >= 4 or (phase == 1 and is_2A)  # noqa: PLR2004


def display_custom_coeff_in_group(question: QuestionMember):
    if not question.group:
        return False

    else:
        questions_in_this_group = QuestionMember.objects.all().filter(
            group=question.group
        )
        allow_custom_coeff_list = np.array(
            [q.allow_custom_coef for q in questions_in_this_group]
        )

        return np.sum(allow_custom_coeff_list) > 0
