from django.conf import settings


def navbar_context(request):
    """Loads context on all pages."""
    webpush_settings = getattr(settings, "PUSH_NOTIFICATIONS_SETTINGS", {})
    vapid_key = webpush_settings.get("WP_PUBLIC_KEY", "")
    return {"vapid_key": vapid_key}
