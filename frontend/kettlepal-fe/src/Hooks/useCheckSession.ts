import { useUser } from "../Contexts/UserContext";
import { useCheckSessionQuery } from "../generated/frontend-types";

// The server handles authentication access with HTTP-Only JWT tokens.
// The client keeps track in state. However, if a user clears their
// cookies, the server knows, but the UserContext doesn't. Here,
// we're polling the server to keep client state in sync with the server.

export function useCheckSession() {
  const { user } = useUser();
  return useCheckSessionQuery({
    fetchPolicy: "network-only",
    pollInterval: user ? 12 * 60 * 1000 : 0, // 12mins if logged in.
  });
}
