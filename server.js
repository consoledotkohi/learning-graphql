import { ApolloServer, gql } from 'apollo-server'

let tweets = [
  {
    id: '1',
    text: 'hello 1',
    userId: '2',
  },
  {
    id: '2',
    text: 'hello 2',
    userId: '1',
  },
]

let users = [
  {
    id: '1',
    firstName: 'kohi',
    lastName: 'park',
  },
  {
    id: '2',
    firstName: 'latte',
    lastName: 'kim',
  },
]

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }

  type Tweet {
    id: ID!
    text: String!
    author: User!
  }

  type Query {
    allUsers: [User]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    ping: String
  }

  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`

const resolvers = {
  Query: {
    allTweets() {
      return tweets
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id)
    },
    allUsers() {
      console.log('allUsers called')
      return users
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const hasUserId = users.find((user) => user.id === userId)
      if (!hasUserId) {
        console.log('error 🤯')
        return null
      }

      const newTweet = {
        id: tweets.length + 1,
        text,
      }
      tweets.push(newTweet)
      return newTweet
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id)
      if (!tweet) return false

      tweets = tweets.filter((tweet) => tweet.id !== id)
      return true
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId)
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(url)
})
