import random

import factory


def random_maybe(yes_declaration, no_declaration=None, p=0.5):
    return factory.Maybe(
        decider=factory.LazyFunction(lambda: random.random() < p),
        yes_declaration=yes_declaration,
        no_declaration=no_declaration,
    )
