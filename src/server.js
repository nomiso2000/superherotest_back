const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const superheroRouter = require('./superhero/superhero.route');
require('dotenv').config();

//1.Create server
//2. init global middlewares
//3. Init routes
//4. init db
//5. start listening

module.exports = class SuperheroServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }
  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use(
      '/images',
      express.static(path.join(__dirname, '../public/images'))
    );
  }
  initRoutes() {
    this.server.use('/', superheroRouter);
  }
  async initDatabase() {
    try {
      const connection = await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
      });
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
  startListening() {
    this.server.listen(process.env.PORT, () =>
      console.log('Server is listening on PORT - ', process.env.PORT)
    );
  }
};
