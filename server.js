const express = require('express');
const routes = require('./routes');
const path = require('path');
const session = require('express-session');
// import sequelize connection
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// Privatize information
const sessionSettings = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionSettings));
app.use(express.static(path.join(__dirname, 'config')));


// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(()=> {
  app.listen(PORT, () => console.log(`
¥====================================================¥

          SERVER IS ON AT ${PORT}

        COMMERCE MANAGEMENT BACK END!
  
¥====================================================¥
  `));
});