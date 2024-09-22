require("dotenv").config()
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "API documentation for the E-commerce application",
    },
    servers: [
      {
        url: process.env.BASE_URL,
      },
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
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
