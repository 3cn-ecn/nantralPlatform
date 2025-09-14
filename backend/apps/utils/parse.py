from typing import TypeVar

T = TypeVar("T")


def parse_bool(value: str | None, default: T = None) -> bool | T:
    if value is None:
        return default
    return value.lower().replace("/", "") not in ("false", "0")


def parse_int(value: str | None, default: T = None) -> int | None:
    try:
        return int(value)
    except (ValueError, TypeError):
        return default
