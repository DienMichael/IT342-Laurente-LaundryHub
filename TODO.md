# TODO - Google Auth Fixes (LaundryHub)

## Done
- Fixed Google login to call the correct backend endpoint: `POST /api/auth/google`.

## Remaining
- Implement real Google token verification in `backend/laundryhub/src/main/java/edu/cit/laurente/laundryhub/service/GoogleTokenService.java`.
- Add required Maven dependencies for Google JWT verification.
- Add `google.clientId` (or equivalent) to backend configuration (application.properties or env var) and wire it into verification.
- Rebuild and test Google login end-to-end.

