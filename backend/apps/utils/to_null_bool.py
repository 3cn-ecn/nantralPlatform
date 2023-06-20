def to_null_bool(value: str | None) -> bool | None:
    if value is None:
        return None
    if value.lower() in ("false", "0"):
        return False
    return True
