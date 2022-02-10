# graphql-federation-example
An example repository using GraphQL Federation of multiple REST API's


## Must read

https://www.apollographql.com/docs/federation/subgraphs/

## Cross referencing resolvers

Although its not in this example a resolver may need to get data from a different sub graph. For example, if you wanted to query match history and as part of that you needed to resolve a user type 

``` graphql
query GetMatchHistory ($userId: ID!) {
  matchHistory (id: $userId) {
    matchID {
      players: {
        id
        username
      }
    }
  }
}
```

The match subgraph wouldn't know how to resolve those users, to do this you need to connect the subgraphs by each having a resolving function that lets other subgraphs resolve data from them across types, also known as `__resolveReference`.

This means in the user subgraph you setup a `__resolveReference` resolver like:

``` js
// User subgraph
const resolvers = {
  User: {
    __resolveReference(reference) {
      return fetch(`/user/${reference.id}`);
    }
  },
  // ...
}
```

Then inside the resolver for the match history you tell it the typename and required key:

``` js
// Match subgraph
const resolvers = {
  Match: {
    user(match) {
      return {
        __typename: "User",
        id: match.playerId
      };
    }
  },
  // ...
}
```

This way the supergraph thats called the match graphql subgraph knows where to go next for its data and the keys are already present to fetch it.