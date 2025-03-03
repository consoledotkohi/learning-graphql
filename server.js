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
    """
    Is the sum of firstName + lastName as a string
    """
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
    allMovies: [Movie]!
    tweet(id: ID!): Tweet
    movie(id: Int!): Movie
  }

  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    """
    Deletes a Tweet if found, else returns false
    """
    deleteTweet(id: ID!): Boolean!
  }

  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    genres: [String!]!
    summary: String
    language: String!
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
    allMovies() {
      return fetch('https://yts.mx/api/v2/list_movies.json')
        .then((res) => res.json())
        .then((json) => json.data.movies)
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((res) => res.json())
        .then((json) => json.data.movie)
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
