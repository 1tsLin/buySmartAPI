const client = require("./connection.js");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.listen(3300, () => {
  //node api.js
  console.log("Sever is now listening on http://localhost:3300");
});

client.connect();

/*-------------------------------------------------------------------------------------------------------------
                                                  USERS TABLE
-------------------------------------------------------------------------------------------------------------*/

//Get All Users - URL
app.get("/users", (req, res) => {
  client.query(`Select * from users`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
});

//Get User by Id - URL
app.get("/users/:id", (req, res) => {
  const selectQuery = "SELECT * FROM users WHERE id = $1";
  const queryParams = [req.params.id];

  client.query(selectQuery, queryParams, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.log(err.stack);
      res.status(500).send("Error while fetching user");
    }
  });
});

//Create User
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.post("/users", (req, res) => {
  const user = req.body;
  let insertQuery = `insert into users(id, firstname, lastname, address, password, creation_date, birthday, phone_number, username, products_list) 
                     values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::uuid[])`;

  let queryParams = [
    user.id,
    user.firstname,
    user.lastname,
    user.address,
    user.password,
    user.creation_date,
    user.birthday,
    user.phone_number,
    user.username,
    user.products_list.length > 0 ? user.products_list : "{}",
  ];

  client.query(insertQuery, queryParams, (err, result) => {
    if (!err) {
      res.send("Insertion was successful");
    } else {
      console.log(err.message);
      res.status(500).send(err.message);
    }
  });
});

//Update User Details
app.put("/users/:id", (req, res) => {
  const user = req.body;
  const updateQuery = `update users
                       set firstname = $1,
                       lastname = $2,
                       address = $3,
                       password = $4,
                       creation_date = $5,
                       birthday = $6,
                       phone_number = $7,
                       username = $8,
                       products_list = $9::uuid[]
                       where id = $10`;

  const queryParams = [
    user.firstname,
    user.lastname,
    user.address,
    user.password,
    user.creation_date,
    user.birthday,
    user.phone_number,
    user.username,
    user.products_list.length > 0 ? user.products_list : "{}",
    req.params.id,
  ];

  client.query(updateQuery, queryParams, (err, result) => {
    if (!err) {
      res.send("Update was successful");
    } else {
      console.log(err.stack);
      res.status(500).send("Error during the update");
    }
  });
});

//Delete User
app.delete("/users/:id", (req, res) => {
  const deleteQuery = "DELETE FROM users WHERE id = $1";
  const queryParams = [req.params.id];

  client.query(deleteQuery, queryParams, (err, result) => {
    if (!err) {
      res.send("Deletion was successful");
    } else {
      console.log(err.stack);
      res.status(500).send("Error during deletion");
    }
  });
});

/*-------------------------------------------------------------------------------------------------------------
                                                  PRODUCTS TABLE
-------------------------------------------------------------------------------------------------------------*/

//Get All Products - URL
app.get("/products", (req, res) => {
  client.query(`Select * from products`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
});

//Get Product by Id - URL
app.get("/products/:id", (req, res) => {
  const selectQuery = "SELECT * FROM products WHERE id = $1";
  const queryParams = [req.params.id];

  client.query(selectQuery, queryParams, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.log(err.stack);
      res.status(500).send("Error while fetching product");
    }
  });
});

//Create Product
app.post("/products", (req, res) => {
  const product = req.body;
  let insertQuery = `INSERT INTO products(id, name, price, quantity, description, condition, is_sold, date_publication, date_end, product_type, selling_type) 
                     VALUES($1, $2, $3, $4, $5, $6, $7::boolean, $8, $9, $10, $11)`;

  let queryParams = [
    product.id,
    product.name,
    product.price,
    product.quantity,
    product.description,
    product.condition,
    product.is_sold,
    product.date_publication,
    product.date_end,
    product.product_type,
    product.selling_type,
  ];

  client.query(insertQuery, queryParams, (err, result) => {
    if (!err) {
      res.send("Insertion was successful");
    } else {
      console.log(err.stack);
      res.status(500).send(err.message);
    }
  });
});

//Update Product Detail
app.put("/products/:id", (req, res) => {
  const product = req.body;
  let updateQuery = `UPDATE products
                     SET name = $1,
                         price = $2,
                         quantity = $3,
                         description = $4,
                         condition = $5,
                         is_sold = $6::boolean,
                         date_publication = $7,
                         date_end = $8,
                         product_type = $9,
                         selling_type = $10
                     WHERE id = $11`;

  let queryParams = [
    product.name,
    product.price,
    product.quantity,
    product.description,
    product.condition,
    product.is_sold,
    product.date_publication,
    product.date_end,
    product.product_type,
    product.selling_type,
    req.params.id,
  ];

  client.query(updateQuery, queryParams, (err, result) => {
    if (!err) {
      res.send("Update was successful");
    } else {
      console.log(err.stack);
      res.status(500).send(err.message);
    }
  });
});

//Delete Product
app.delete("/products/:id", (req, res) => {
  const deleteQuery = "DELETE FROM products WHERE id = $1";
  const queryParams = [req.params.id];

  client.query(deleteQuery, queryParams, (err, result) => {
    if (!err) {
      res.send("Deletion was successful");
    } else {
      console.log(err.stack);
      res.status(500).send("Error during deletion");
    }
  });
});
