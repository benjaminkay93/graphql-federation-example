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
    updateUser(id: Int!, balance: Int!): User 
  }

  type User @key(fields: "id") {
    id: Int!
    balance: Int
  }
`;

const resolvers = {
  Query: {
    me: async () => {
      return await fetch(`${restBaseUrl}/user/17`)
    },
    user: async (_, args) => {
      const {id: userId} = args
      return await fetch(`${restBaseUrl}/user/${userId}`)
    },
    statusUser: async () => {
      const response = await fetch(`${restBaseUrl}/`)

      return await response.text();
    }
  },
  Mutation: {
    updateUser: async (_, args) => {
      const {id: userId, balance} = args
      return await fetch(`${restBaseUrl}/user/update/${userId}`, {
        method: 'post',
        body: JSON.stringify({balance}),
        headers: {'Content-Type': 'application/json'}
      })
    }
  },
  User: {
    __resolveReference(user, { fetchUserById }){
      return fetchUserById(user.id)
    }
  }
}

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
});

server.listen(5562).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});