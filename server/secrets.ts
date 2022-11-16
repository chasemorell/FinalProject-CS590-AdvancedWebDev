export const keycloak = {
  client_id: "lastnight",
  client_secret: "VqiYdBkKklDObVGrN8KYPKMBXlRUkWqy", // TODO
  redirect_uris: ["http://127.0.0.1:8080/api/login-callback"],
  post_logout_redirect_uris: [""],
  response_types: ["code"],
}