from typing import TypeVar

T = TypeVar("T")


def parse_bool(value: str | None, default: T = None) -> bool | T:
    if value is None:
        return default
    if value.lower().replace("/", "") in ("false", "0"):
        return False
    return True


def parse_int(value: str | None, default: T = None) -> int | None:
    try:
        return int(value)
    except (ValueError, TypeError):
        return default
