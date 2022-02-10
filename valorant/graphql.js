const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const fetch = require('node-fetch');

const restBaseUrl = 'http://localhost:5551'

const typeDefs = gql`
  type Query {
    userValorantDetails(id: Int!): ValorantUser
    statusValorant: String
  }

  type Mutation {
    updateValorantUserTag(id: Int!, name: String!, tag: String!): ValorantTag
  }

  type ValorantTag {
    name: String!
    tag: String!
  }

  type ValorantMatch {
    matchId: String!
    startTime: String!
    isRanked: Boolean!
    isCompleted: Boolean!
  }

  type ValorantShard {
    shard: String!
    refinedMatchHistoryForShard: [ValorantMatch]!
  }

  type ValorantUser {
    id: Int
    shards: [ValorantShard]!
  }

`;

const resolvers = {
  Query: {
    statusValorant: async () => {
      const response = await fetch(`${restBaseUrl}/`)

      return await response.text();
    },
    userValorantDetails: async (_, {id}) => {
      const shards = await fetch(`${restBaseUrl}/connect-user`)

      return {
        shards,
        id
      }
    }
  },
  Mutation: {
    updateValorantUserTag: async (_, {name, tag}) => {
      return await fetch(`${restBaseUrl}/update-user`, {
        method: 'post',
        body: JSON.stringify({balance}),
        headers: {'Content-Type': 'application/json'}
      })
    },
  },
}

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
});

server.listen(5552).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});