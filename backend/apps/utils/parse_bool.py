from typing import TypeVar

T = TypeVar("T")


def parse_bool(value: str | None, default: T = None) -> bool | T:
    if value is None:
        return default

    formatted_value = value.lower().replace("/", "")

    return formatted_value not in ("false", "0")
