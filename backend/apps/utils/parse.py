def parse_bool[T](value: str | None, default: T = None) -> bool | T:
    if value is None:
        return default
    return value.lower().replace("/", "") not in ("false", "0")


def parse_int[T](value: str | None, default: T = None) -> int | None:
    try:
        return int(value)
    except (ValueError, TypeError):
        return default
