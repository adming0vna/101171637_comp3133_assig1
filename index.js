const express = require('express');
const mongoose = require('mongoose');
const TypeDefs = require('./schema');
const Resolvers = require('./resolver');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

const dotenv = require('dotenv');
dotenv.config();


const url = process.env.MONGODB_URL;


const connect = mongoose.connect(url, 
{ 
      useNewUrlParser: true,
      useUnifiedTopology: true
});

connect.then((db) => {
      console.log('Connected correctly to server!');
}, (err) => {
      console.log(err);
});


const server = new ApolloServer({
      typeDefs: TypeDefs.typeDefs,
      resolvers: Resolvers.resolver
});


const app = express();
app.use('*', cors());
server.start().then(res => {
    server.applyMiddleware({
      app,
      cors: false
    })
    app.listen({ port: process.env.PORT }, () =>
      console.log(`Server running on http://localhost:${process.env.PORT}${server.graphqlPath}`))
  });