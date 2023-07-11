from typing import TypeVar

T = TypeVar('T')


def to_null_bool(value: str | None, default: T = None) -> bool | T:
    if value is None:
        return default
    if value.lower() in ("false", "0"):
        return False
    return True
