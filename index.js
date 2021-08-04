const express = require("express");
const app = express();
require("dotenv").config();

// Validation
require("./startup/validation")();

// Handling Errors
require("./startup/logging")();

// Routes
require("./startup/routes")(app);

// Connect Mongoose
require("./startup/db")();

// Production module
require("./startup/prod")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`info: Listening on port ${port}...`));

module.exports = server;
