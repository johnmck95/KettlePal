export interface GraphQLErrorExtensions {
  code: string;
  http: { status: number };
}

export class NotAuthorizedError extends Error {
  extensions: GraphQLErrorExtensions;

  constructor(message = "User is not authorized to access this resource.") {
    super(message);
    this.name = "NotAuthorizedError";
    this.extensions = {
      code: "UNAUTHORIZED",
      http: { status: 401 },
    };
  }
}
