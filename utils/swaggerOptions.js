export const options = {
  definition: {
    openapi: "3.0.0",
    servers: [
      {
        url: "http://localhost:5000/",
      },
    ],
    info: {
      title: "Rest-Api",
      version: "1.0.0",
      description: "Your API Description",
    },
  },
  apis: ["./routes/*.js", "./models/*.js"],
};
