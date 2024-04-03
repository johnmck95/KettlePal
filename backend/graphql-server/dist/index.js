import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
const server = new ApolloServer({
// typedefs
// resolvers
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log("Server Ready at Port 4000");
