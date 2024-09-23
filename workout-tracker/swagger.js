require("dotenv").config();
const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    version: "1.0.0",
    title: "Workout Tracker API",
    description: "API documentation for the Workout Tracker application",
  },
  servers: [
    {
      url: process.env.BASE_URL,
      description: "Base url of the server",
    },
    // { ... }
  ],
  tags: [],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  }, // by default: empty object
};

const outputFile = "./swagger-output.json";
const routes = ["./routes/*.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc).then(() => {
  require("./index.js"); // Your project's root file
});
