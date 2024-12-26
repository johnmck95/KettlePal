export const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://kettlepal.netlify.app",
  "https://kettlepal.onrender.com",
];

export function frontendURL() {
  return process.env.NODE_ENV === "production"
    ? "https://kettlepal.netlify.app"
    : "http://localhost:3000";
}

export function backendURL() {
  return process.env.NODE_ENV === "production"
    ? "https://kettlepal.onrender.com/graphql"
    : "http://localhost:4000/graphql";
}
