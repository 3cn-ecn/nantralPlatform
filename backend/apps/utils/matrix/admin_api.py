import time
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Literal

from django.conf import settings

import requests

JSON = dict[str, Any]


@dataclass(slots=True)
class _Token:
    access_token: str
    expires_at: float


@dataclass(slots=True)
class PaginationParams:
    before: str | None = None
    after: str | None = None
    first: int | None = None
    last: int | None = None

    def as_query(self) -> dict[str, Any]:
        return {
            "page[before]": self.before,
            "page[after]": self.after,
            "page[first]": self.first,
            "page[last]": self.last,
        }


@dataclass(slots=True)
class UserSessionFilters:
    user: str | None = None
    status: Literal["active", "finished"] | None = None
    created_before: datetime | None = None
    created_after: datetime | None = None
    last_active_before: datetime | None = None
    last_active_after: datetime | None = None

    def as_query(self) -> dict[str, Any]:
        return {
            "filter[user]": self.user,
            "filter[status]": self.status,
            "filter[created-before]": self.created_before,
            "filter[created-after]": self.created_after,
            "filter[last-active-before]": self.last_active_before,
            "filter[last-active-after]": self.last_active_after,
        }


@dataclass(slots=True)
class UserRegistrationTokenFilters:
    used: bool | None = None
    revoked: bool | None = None
    expired: bool | None = None
    valid: bool | None = None

    def as_query(self) -> dict[str, Any]:
        return {
            "filter[used]": self.used,
            "filter[revoked]": self.revoked,
            "filter[expired]": self.expired,
            "filter[valid]": self.valid,
        }


@dataclass(slots=True)
class UpstreamOAuthLinkFilters:
    user: str | None = None
    provider: str | None = None
    subject: str | None = None
    human_account_name: str | None = None

    def as_query(self) -> dict[str, Any]:
        return {
            "filter[user]": self.user,
            "filter[provider]": self.provider,
            "filter[subject]": self.subject,
            "filter[human-account-name]": self.human_account_name,
        }


@dataclass(slots=True)
class UpstreamOAuthProviderFilters:
    enabled: bool | None = None

    def as_query(self) -> dict[str, Any]:
        return {
            "filter[enabled]": self.enabled,
        }


@dataclass(slots=True)
class CompatSessionFilters:
    user: str | None = None
    user_session: str | None = None
    status: Literal["active", "finished"] | None = None
    created_before: datetime | None = None
    created_after: datetime | None = None
    last_active_before: datetime | None = None
    last_active_after: datetime | None = None

    def as_query(self) -> dict[str, Any]:
        return {
            "filter[user]": self.user,
            "filter[user-session]": self.user_session,
            "filter[status]": self.status,
            "filter[created-before]": self.created_before,
            "filter[created-after]": self.created_after,
            "filter[last-active-before]": self.last_active_before,
            "filter[last-active-after]": self.last_active_after,
        }


@dataclass(slots=True)
class Oauth2ClientFilters:
    client_kind: Literal["dynamic", "static"] | None = None
    client_name: str | None = None
    client_uri: str | None = None
    grant_type: str | None = None
    has_active_sessions: bool | None = None

    def as_query(self) -> dict[str, Any]:
        return {
            "filter[client-kind]": self.client_kind,
            "filter[client-name]": self.client_name,
            "filter[client-uri]": self.client_uri,
            "filter[grant-type]": self.grant_type,
            "filter[has-active-sessions]": self.has_active_sessions,
        }


@dataclass(slots=True)
class Oauth2SessionFilters:
    user: str | None = None
    client: list[str] | None = None
    client_kind: Literal["dynamic", "static"] | None = None
    user_session: str | None = None
    scope: list[str] | None = None
    status: Literal["active", "finished"] | None = None
    created_before: datetime | None = None
    created_after: datetime | None = None
    last_active_before: datetime | None = None
    last_active_after: datetime | None = None

    def as_query(self) -> dict[str, Any]:
        return {
            "filter[user]": self.user,
            "filter[client]": self.client,
            "filter[client-kind]": self.client_kind,
            "filter[user-session]": self.user_session,
            "filter[scope]": self.scope,
            "filter[status]": self.status,
            "filter[created-before]": self.created_before,
            "filter[created-after]": self.created_after,
            "filter[last-active-before]": self.last_active_before,
            "filter[last-active-after]": self.last_active_after,
        }


@dataclass(slots=True)
class PersonalSessionFilters:
    owner_user: str | None = None
    owner_client: str | None = None
    actor_user: str | None = None
    scope: list[str] | None = None
    status: Literal["active", "revoked"] | None = None
    expires_before: datetime | None = None
    expires_after: datetime | None = None
    expires: bool | None = None

    def as_query(self) -> dict[str, Any]:
        return {
            "filter[owner_user]": self.owner_user,
            "filter[owner_client]": self.owner_client,
            "filter[actor_user]": self.actor_user,
            "filter[scope]": self.scope,
            "filter[status]": self.status,
            "filter[expires_before]": self.expires_before,
            "filter[expires_after]": self.expires_after,
            "filter[expires]": self.expires,
        }


@dataclass(slots=True)
class UserFilters:
    admin: bool | None = None
    legacy_guest: bool | None = None
    search: str | None = None
    status: Literal["active", "locked", "deactivated"] | None = None
    active_oauth2_client: list[str] | None = None
    has_active_oauth2_session: bool | None = None
    has_active_compat_session: bool | None = None

    def as_query(self) -> dict[str, Any]:
        return {
            "filter[admin]": self.admin,
            "filter[legacy-guest]": self.legacy_guest,
            "filter[search]": self.search,
            "filter[status]": self.status,
            "filter[active-oauth2-client]": self.active_oauth2_client,
            "filter[has-active-oauth2-session]": self.has_active_oauth2_session,
            "filter[has-active-compat-session]": self.has_active_compat_session,
        }


@dataclass(slots=True)
class UserEmailFilters:
    user: str | None = None
    email: str | None = None

    def as_query(self) -> dict[str, Any]:
        return {
            "filter[user]": self.user,
            "filter[email]": self.email,
        }


class MatrixAdminAPI:
    """Typed interface for the MAS admin API from the supplied specification."""

    def __init__(
        self,
        client_id: str,
        client_secret: str,
        base_url: str,
        timeout: float = 30.0,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.client_id = client_id
        self.client_secret = client_secret
        self.timeout = timeout
        self.session = requests.Session()
        self._token: _Token | None = None

    def get_access_token(self) -> str:
        """Return the cached OAuth2 client-credentials token or refresh it."""
        if (
            self._token is not None
            and time.monotonic() < self._token.expires_at
        ):
            return self._token.access_token
        response = self.session.post(
            f"{self.base_url}/auth/oauth2/token",
            data={"grant_type": "client_credentials", "scope": "urn:mas:admin"},
            auth=(self.client_id, self.client_secret),
            timeout=self.timeout,
        )
        response.raise_for_status()
        payload = response.json()
        expires_in = int(payload.get("expires_in", 3600))
        self._token = _Token(
            payload["access_token"], time.monotonic() + max(0, expires_in - 30)
        )
        return self._token.access_token

    def _request(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, Any] | None = None,
        json: Any = None,
    ) -> requests.Response:
        headers = {"Authorization": f"Bearer {self.get_access_token()}"}
        response = self.session.request(
            method,
            f"{self.base_url}{path}",
            headers=headers,
            params=params,
            json=json,
            timeout=self.timeout,
        )
        if response.status_code == requests.codes.unauthorized:
            self._token = None
            headers["Authorization"] = f"Bearer {self.get_access_token()}"
            response = self.session.request(
                method,
                f"{self.base_url}{path}",
                headers=headers,
                params=params,
                json=json,
                timeout=self.timeout,
            )
        response.raise_for_status()
        return response

    def _json(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, Any] | None = None,
        json: Any = None,
    ) -> JSON | None:
        response = self._request(method, path, params=params, json=json)
        if (
            response.status_code == requests.codes.no_content
            or not response.content
        ):
            return None
        return response.json()

    @staticmethod
    def _query(values: dict[str, Any]) -> dict[str, Any]:
        return {
            k: v.isoformat() if isinstance(v, datetime) else v
            for k, v in values.items()
            if v is not None
        }

    def site_config(
        self,
    ) -> JSON | None:
        """Get information about the configuration of this MAS instance."""
        params = None
        return self._json(
            "GET", "/auth/api/admin/v1/site-config", params=params
        )

    def version(
        self,
    ) -> JSON | None:
        """Get the version currently running."""
        params = None
        return self._json("GET", "/auth/api/admin/v1/version", params=params)

    def register_available(self, username: str) -> bool:
        """Return True when a username can be registered, otherwise raise with reason."""
        params = self._query({"username": username})
        response = self.session.get(
            f"{self.base_url}/_matrix/client/v3/register/available",
            params=params,
            timeout=self.timeout,
        )

        if response.status_code == requests.codes.ok:
            payload = response.json()
            if payload.get("available") is True:
                return True
            raise ValueError(
                "Username availability response is missing available=true."
            )

        try:
            payload = response.json()
        except ValueError:
            response.raise_for_status()
            raise

        errcode = payload.get("errcode", "M_UNKNOWN")
        error = payload.get("error", "Request refused.")
        retry_after_ms = payload.get("retry_after_ms")

        if response.status_code == requests.codes.too_many_requests:
            if retry_after_ms is not None:
                raise ValueError(
                    f"{errcode}: {error} (retry_after_ms={retry_after_ms})"
                )
            raise ValueError(f"{errcode}: {error}")

        if response.status_code == requests.codes.bad_request:
            raise ValueError(f"{errcode}: {error}")

        response.raise_for_status()
        raise ValueError(f"{errcode}: {error}")

    def list_compat_sessions(
        self,
        pagination: PaginationParams | None = None,
        count: Literal["true", "false", "only"] | None = None,
        filters: CompatSessionFilters | None = None,
    ) -> JSON | None:
        """List compatibility sessions."""
        pagination = pagination or PaginationParams()
        filters = filters or CompatSessionFilters()
        params = self._query(
            {
                **pagination.as_query(),
                "count": count,
                **filters.as_query(),
            }
        )
        return self._json(
            "GET", "/auth/api/admin/v1/compat-sessions", params=params
        )

    def get_compat_session(self, session_id: str) -> JSON | None:
        """Get a compatibility session."""
        params = None
        return self._json(
            "GET",
            f"/auth/api/admin/v1/compat-sessions/{session_id}",
            params=params,
        )

    def finish_compat_session(self, session_id: str) -> JSON | None:
        """Finish a compatibility session."""
        params = None
        return self._json(
            "POST",
            f"/auth/api/admin/v1/compat-sessions/{session_id}/finish",
            params=params,
        )

    def list_oauth2_clients(
        self,
        pagination: PaginationParams | None = None,
        count: Literal["true", "false", "only"] | None = None,
        filters: Oauth2ClientFilters | None = None,
    ) -> JSON | None:
        """List OAuth 2.0 clients."""
        pagination = pagination or PaginationParams()
        filters = filters or Oauth2ClientFilters()
        params = self._query(
            {
                **pagination.as_query(),
                "count": count,
                **filters.as_query(),
            }
        )
        return self._json(
            "GET", "/auth/api/admin/v1/oauth2-clients", params=params
        )

    def get_oauth2_client(self, client_id: str) -> JSON | None:
        """Get an OAuth 2.0 client."""
        params = None
        return self._json(
            "GET",
            f"/auth/api/admin/v1/oauth2-clients/{client_id}",
            params=params,
        )

    def list_oauth2_sessions(
        self,
        pagination: PaginationParams | None = None,
        count: Literal["true", "false", "only"] | None = None,
        filters: Oauth2SessionFilters | None = None,
    ) -> JSON | None:
        """List OAuth 2.0 sessions."""
        pagination = pagination or PaginationParams()
        filters = filters or Oauth2SessionFilters()
        params = self._query(
            {
                **pagination.as_query(),
                "count": count,
                **filters.as_query(),
            }
        )
        return self._json(
            "GET", "/auth/api/admin/v1/oauth2-sessions", params=params
        )

    def get_oauth2_session(self, client_id: str) -> JSON | None:
        """Get an OAuth 2.0 session."""
        params = None
        return self._json(
            "GET",
            f"/auth/api/admin/v1/oauth2-sessions/{client_id}",
            params=params,
        )

    def finish_oauth2_session(self, client_id: str) -> JSON | None:
        """Finish an OAuth 2.0 session."""
        params = None
        return self._json(
            "POST",
            f"/auth/api/admin/v1/oauth2-sessions/{client_id}/finish",
            params=params,
        )

    def list_personal_sessions(
        self,
        pagination: PaginationParams | None = None,
        count: Literal["true", "false", "only"] | None = None,
        filters: PersonalSessionFilters | None = None,
    ) -> JSON | None:
        """List personal sessions."""
        pagination = pagination or PaginationParams()
        filters = filters or PersonalSessionFilters()
        params = self._query(
            {
                **pagination.as_query(),
                "count": count,
                **filters.as_query(),
            }
        )
        return self._json(
            "GET", "/auth/api/admin/v1/personal-sessions", params=params
        )

    def create_personal_session(
        self,
        actor_user_id: Any,
        human_name: str,
        scope: str,
        expires_in: int | None = None,
    ) -> JSON | None:
        """Create a new personal session with personal access token."""
        params = None
        payload = {
            "actor_user_id": actor_user_id,
            "human_name": human_name,
            "scope": scope,
            "expires_in": expires_in,
        }
        return self._json(
            "POST",
            "/auth/api/admin/v1/personal-sessions",
            params=params,
            json=payload,
        )

    def get_personal_session(self, session_id: str) -> JSON | None:
        """Get a personal session."""
        params = None
        return self._json(
            "GET",
            f"/auth/api/admin/v1/personal-sessions/{session_id}",
            params=params,
        )

    def revoke_personal_session(self, session_id: str) -> JSON | None:
        """Revoke a personal session."""
        params = None
        return self._json(
            "POST",
            f"/auth/api/admin/v1/personal-sessions/{session_id}/revoke",
            params=params,
        )

    def regenerate_personal_session(
        self, session_id: str, expires_in: int | None = None
    ) -> JSON | None:
        """Regenerate a personal session by replacing its personal access token."""
        params = None
        payload = {
            "expires_in": expires_in,
        }
        return self._json(
            "POST",
            f"/auth/api/admin/v1/personal-sessions/{session_id}/regenerate",
            params=params,
            json=payload,
        )

    def set_policy_data(self, data: Any) -> JSON | None:
        """Set the current policy data."""
        params = None
        payload = {
            "data": data,
        }
        return self._json(
            "POST",
            "/auth/api/admin/v1/policy-data",
            params=params,
            json=payload,
        )

    def get_latest_policy_data(
        self,
    ) -> JSON | None:
        """Get the latest policy data."""
        params = None
        return self._json(
            "GET", "/auth/api/admin/v1/policy-data/latest", params=params
        )

    def get_policy_data(self, policy_id: str) -> JSON | None:
        """Get policy data by ID."""
        params = None
        return self._json(
            "GET", f"/auth/api/admin/v1/policy-data/{policy_id}", params=params
        )

    def list_users(
        self,
        pagination: PaginationParams | None = None,
        count: Literal["true", "false", "only"] | None = None,
        filters: UserFilters | None = None,
    ) -> JSON | None:
        """List users."""
        pagination = pagination or PaginationParams()
        filters = filters or UserFilters()
        params = self._query(
            {
                **pagination.as_query(),
                "count": count,
                **filters.as_query(),
            }
        )
        return self._json("GET", "/auth/api/admin/v1/users", params=params)

    def create_user(
        self,
        username: str,
        skip_homeserver_check: bool = False,
        displayname: str | None = None,
        avatar_url: str | None = None,
    ) -> JSON | None:
        """Create a new user."""
        params = None
        payload = {
            "username": username,
            "skip_homeserver_check": skip_homeserver_check,
            "displayname": displayname,
            "avatar_url": avatar_url,
        }
        return self._json(
            "POST", "/auth/api/admin/v1/users", params=params, json=payload
        )

    def get_user(self, user_id: str) -> JSON | None:
        """Get a user."""
        params = None
        return self._json(
            "GET", f"/auth/api/admin/v1/users/{user_id}", params=params
        )

    def set_user_password(
        self,
        user_id: str,
        password: str,
        skip_password_check: bool | None = None,
    ) -> JSON | None:
        """Set the password for a user."""
        params = None
        payload = {
            "password": password,
            "skip_password_check": skip_password_check,
        }
        return self._json(
            "POST",
            f"/auth/api/admin/v1/users/{user_id}/set-password",
            params=params,
            json=payload,
        )

    def get_user_by_username(self, username: str) -> JSON | None:
        """Get a user by its username (localpart)."""
        params = None
        return self._json(
            "GET",
            f"/auth/api/admin/v1/users/by-username/{username}",
            params=params,
        )

    def user_set_admin(self, user_id: str, admin: bool) -> JSON | None:
        """Set whether a user can request admin."""
        params = None
        payload = {
            "admin": admin,
        }
        return self._json(
            "POST",
            f"/auth/api/admin/v1/users/{user_id}/set-admin",
            params=params,
            json=payload,
        )

    def deactivate_user(
        self, user_id: str, skip_erase: bool = False
    ) -> JSON | None:
        """Deactivate a user."""
        params = None
        payload = {
            "skip_erase": skip_erase,
        }
        return self._json(
            "POST",
            f"/auth/api/admin/v1/users/{user_id}/deactivate",
            params=params,
            json=payload,
        )

    def reactivate_user(self, user_id: str) -> JSON | None:
        """Reactivate a user."""
        params = None
        return self._json(
            "POST",
            f"/auth/api/admin/v1/users/{user_id}/reactivate",
            params=params,
        )

    def lock_user(self, user_id: str) -> JSON | None:
        """Lock a user."""
        params = None
        return self._json(
            "POST", f"/auth/api/admin/v1/users/{user_id}/lock", params=params
        )

    def unlock_user(self, user_id: str) -> JSON | None:
        """Unlock a user."""
        params = None
        return self._json(
            "POST", f"/auth/api/admin/v1/users/{user_id}/unlock", params=params
        )

    def list_user_emails(
        self,
        pagination: PaginationParams | None = None,
        count: Literal["true", "false", "only"] | None = None,
        filters: UserEmailFilters | None = None,
    ) -> JSON | None:
        """List user emails."""
        pagination = pagination or PaginationParams()
        filters = filters or UserEmailFilters()
        params = self._query(
            {
                **pagination.as_query(),
                "count": count,
                **filters.as_query(),
            }
        )
        return self._json(
            "GET", "/auth/api/admin/v1/user-emails", params=params
        )

    def add_user_email(self, user_id: Any, email: str) -> JSON | None:
        """Add a user email."""
        params = None
        payload = {
            "user_id": user_id,
            "email": email,
        }
        return self._json(
            "POST",
            "/auth/api/admin/v1/user-emails",
            params=params,
            json=payload,
        )

    def get_user_email(self, email_id: str) -> JSON | None:
        """Get a user email."""
        params = None
        return self._json(
            "GET", f"/auth/api/admin/v1/user-emails/{email_id}", params=params
        )

    def delete_user_email(self, email_id: str) -> JSON | None:
        """Delete a user email."""
        params = None
        return self._json(
            "DELETE",
            f"/auth/api/admin/v1/user-emails/{email_id}",
            params=params,
        )

    def list_user_sessions(
        self,
        pagination: PaginationParams | None = None,
        count: Literal["true", "false", "only"] | None = None,
        filters: UserSessionFilters | None = None,
    ) -> JSON | None:
        """List user sessions."""
        pagination = pagination or PaginationParams()
        filters = filters or UserSessionFilters()
        params = self._query(
            {
                **pagination.as_query(),
                "count": count,
                **filters.as_query(),
            }
        )
        return self._json(
            "GET", "/auth/api/admin/v1/user-sessions", params=params
        )

    def get_user_session(self, session_id: str) -> JSON | None:
        """Get a user session."""
        params = None
        return self._json(
            "GET",
            f"/auth/api/admin/v1/user-sessions/{session_id}",
            params=params,
        )

    def finish_user_session(self, session_id: str) -> JSON | None:
        """Finish a user session."""
        params = None
        return self._json(
            "POST",
            f"/auth/api/admin/v1/user-sessions/{session_id}/finish",
            params=params,
        )

    def list_user_registration_tokens(
        self,
        pagination: PaginationParams | None = None,
        count: Literal["true", "false", "only"] | None = None,
        filters: UserRegistrationTokenFilters | None = None,
    ) -> JSON | None:
        """List user registration tokens."""
        pagination = pagination or PaginationParams()
        filters = filters or UserRegistrationTokenFilters()
        params = self._query(
            {
                **pagination.as_query(),
                "count": count,
                **filters.as_query(),
            }
        )
        return self._json(
            "GET", "/auth/api/admin/v1/user-registration-tokens", params=params
        )

    def add_user_registration_token(
        self,
        token: str | None = None,
        usage_limit: int | None = None,
        expires_at: datetime | None = None,
    ) -> JSON | None:
        """Create a new user registration token."""
        params = None
        payload = {
            "token": token,
            "usage_limit": usage_limit,
            "expires_at": expires_at,
        }
        return self._json(
            "POST",
            "/auth/api/admin/v1/user-registration-tokens",
            params=params,
            json=payload,
        )

    def get_user_registration_token(self, token_id: str) -> JSON | None:
        """Get a user registration token."""
        params = None
        return self._json(
            "GET",
            f"/auth/api/admin/v1/user-registration-tokens/{token_id}",
            params=params,
        )

    def update_user_registration_token(
        self,
        token_id: str,
        expires_at: datetime | None = None,
        usage_limit: int | None = None,
    ) -> JSON | None:
        """Update a user registration token."""
        params = None
        payload = {
            "expires_at": expires_at,
            "usage_limit": usage_limit,
        }
        return self._json(
            "PUT",
            f"/auth/api/admin/v1/user-registration-tokens/{token_id}",
            params=params,
            json=payload,
        )

    def revoke_user_registration_token(self, token_id: str) -> JSON | None:
        """Revoke a user registration token."""
        params = None
        return self._json(
            "POST",
            f"/auth/api/admin/v1/user-registration-tokens/{token_id}/revoke",
            params=params,
        )

    def un_revoke_user_registration_token(self, token_id: str) -> JSON | None:
        """Un-revoke a user registration token."""
        params = None
        return self._json(
            "POST",
            f"/auth/api/admin/v1/user-registration-tokens/{token_id}/unrevoke",
            params=params,
        )

    def list_upstream_oauth_links(
        self,
        pagination: PaginationParams | None = None,
        count: Literal["true", "false", "only"] | None = None,
        filters: UpstreamOAuthLinkFilters | None = None,
    ) -> JSON | None:
        """List upstream OAuth 2.0 links."""
        pagination = pagination or PaginationParams()
        filters = filters or UpstreamOAuthLinkFilters()
        params = self._query(
            {
                **pagination.as_query(),
                "count": count,
                **filters.as_query(),
            }
        )
        return self._json(
            "GET", "/auth/api/admin/v1/upstream-oauth-links", params=params
        )

    def add_upstream_oauth_link(
        self,
        user_id: Any,
        provider_id: Any,
        subject: str,
        human_account_name: str | None = None,
    ) -> JSON | None:
        """Add an upstream OAuth 2.0 link."""
        params = None
        payload = {
            "user_id": user_id,
            "provider_id": provider_id,
            "subject": subject,
            "human_account_name": human_account_name,
        }
        return self._json(
            "POST",
            "/auth/api/admin/v1/upstream-oauth-links",
            params=params,
            json=payload,
        )

    def get_upstream_oauth_link(self, link_id: str) -> JSON | None:
        """Get an upstream OAuth 2.0 link."""
        params = None
        return self._json(
            "GET",
            f"/auth/api/admin/v1/upstream-oauth-links/{link_id}",
            params=params,
        )

    def delete_upstream_oauth_link(self, link_id: str) -> JSON | None:
        """Delete an upstream OAuth 2.0 link."""
        params = None
        return self._json(
            "DELETE",
            f"/auth/api/admin/v1/upstream-oauth-links/{link_id}",
            params=params,
        )

    def list_upstream_oauth_providers(
        self,
        pagination: PaginationParams | None = None,
        count: Literal["true", "false", "only"] | None = None,
        filters: UpstreamOAuthProviderFilters | None = None,
    ) -> JSON | None:
        """List upstream OAuth 2.0 providers."""
        pagination = pagination or PaginationParams()
        filters = filters or UpstreamOAuthProviderFilters()
        params = self._query(
            {
                **pagination.as_query(),
                "count": count,
                **filters.as_query(),
            }
        )
        return self._json(
            "GET", "/auth/api/admin/v1/upstream-oauth-providers", params=params
        )

    def get_upstream_oauth_provider(self, provider_id: str) -> JSON | None:
        """Get upstream OAuth provider."""
        params = None
        return self._json(
            "GET",
            f"/auth/api/admin/v1/upstream-oauth-providers/{provider_id}",
            params=params,
        )


matrix_admin_api = MatrixAdminAPI(
    client_id=settings.MATRIX_CLIENT_ID,
    client_secret=settings.MATRIX_CLIENT_TOKEN,
    base_url=settings.MATRIX_BASE_URL,
)
