export function frontendURL() {
  return process.env.NODE_ENV === "production"
    ? "https://kettlepal.netlify.app"
    : "http://localhost:3000";
}

export function backendURL() {
  return process.env.NODE_ENV === "production"
    ? "/api/graphql"
    : "http://localhost:4000/graphql";
}
