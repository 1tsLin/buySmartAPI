const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "123Soleil.",
  database: "postgres",
});

module.exports = client;
