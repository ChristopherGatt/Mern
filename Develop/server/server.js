const express = require('express')
const path = require('path')
const db = require('./config/connection')
const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 3001

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// if we're in production, serve client/build as static assets

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start()
  server.applyMiddleware({ app })

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')))
  }

  app.use(routes)

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`))
  })
}

startApolloServer(typeDefs, resolvers)
