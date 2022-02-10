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
      const shardsStream = await fetch(`${restBaseUrl}/valorant/connect-user`)
      const shards = await shardsStream.json();

      return {
        shards,
        id
      }
    }
  },
  Mutation: {
    updateValorantUserTag: async (_, {name, tag}) => {
      const stream = await fetch(`${restBaseUrl}/valorant/update-user`, {
        method: 'post',
        body: JSON.stringify({name, tag}),
        headers: {'Content-Type': 'application/json'}
      })
      
      const data = await stream.json()

      return data
    },
  },
}

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
});

server.listen(5552).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});