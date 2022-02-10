const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const fetch = require('node-fetch');

const restBaseUrl = 'http://localhost:5571'

const typeDefs = gql`
  type Query {
    statusBalance: String
  }

  type Mutation {
    updateBalance(id: Int!, username: String!): User 
  }

  extend type User @key(fields: "id") {
    id: Int! @external
    balance: Int!
  }
`;

const resolvers = {
  Query: {
    statusBalance: async () => {
      const response = await fetch(`${restBaseUrl}/`)

      return await response.text();
    }
  },
  Mutation: {
    updateBalance: async (_, args) => {
      const {id, balance} = args
      const stream = await fetch(`${restBaseUrl}/user/update/${id}`, {
        method: 'post',
        body: JSON.stringify({balance}),
        headers: {'Content-Type': 'application/json'}
      })
      return await stream.json()
    }
  },
  User: {
    balance: async (_, args) => {
      const {id} = args
      const stream = await fetch(`${restBaseUrl}/balance/${id}`)
      const { balance } = await stream.json()

      return balance
    }
  }
}

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
});

server.listen(5572).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});