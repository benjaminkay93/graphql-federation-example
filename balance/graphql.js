const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const fetch = require('node-fetch');

const restBaseUrl = 'http://localhost:5561'

const typeDefs = gql`
  type Query {
    me: User
    user(id: Int!): User 
    statusUser: String
  }

  type Mutation {
    updateUser(id: Int!, username: String!): User 
  }

  type User @key(fields: "id") {
    id: Int!
    username: String!
  }
`;

const resolvers = {
  Query: {
    me: async () => {
      const stream = await fetch(`${restBaseUrl}/user/17`)
      return await stream.json();
    },
    user: async (_, args) => {
      const {id: userId} = args
      const stream = await fetch(`${restBaseUrl}/user/${userId}`)

      return await stream.json()
    },
    statusUser: async () => {
      const response = await fetch(`${restBaseUrl}/`)

      return await response.text();
    }
  },
  Mutation: {
    updateUser: async (_, args) => {
      const {id: userId, username} = args
      const stream = await fetch(`${restBaseUrl}/user/update/${userId}`, {
        method: 'post',
        body: JSON.stringify({username}),
        headers: {'Content-Type': 'application/json'}
      })
      return await stream.json()
    }
  },
}

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
});

server.listen(5562).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});