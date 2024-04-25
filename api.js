const client = require("./connection.js");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
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
app.use("/uploads", express.static("uploads"));

const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const PORT = 3300;

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Ensure this uploads folder exists
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + fileExt);
  },
});

// Initialize upload variable
const upload = multer({ storage: storage });

app.post("/products", upload.single("image"), (req, res) => {
  const upload = multer({ storage: storage });

  const product = req.body;
  const image = req.file;
  let insertQuery = `INSERT INTO products(id, name, price, quantity, description, product_type, image_path, user_id) 
                     VALUES($1, $2, $3, $4, $5, $6, $7, $8)`;

  const imagePath = image ? image.path : null;

  let queryParams = [
    product.id,
    product.name,
    product.price,
    product.quantity,
    product.description,
    product.product_type,
    imagePath,
    product.user_id,
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

//Update product by Id
app.put("/products/:id", upload.single("image"), (req, res) => {
  const product = req.body;
  const image = req.file;

  let updateQuery = `
    UPDATE products
    SET 
      name = $1, 
      price = $2, 
      quantity = $3, 
      description = $4, 
      product_type = $5, 
      image_path = $6,
      user_id = $7
    WHERE id = $8`;

  const imagePath = image ? image.path : product.existingImagePath;

  let queryParams = [
    product.name,
    product.price,
    product.quantity,
    product.description,
    product.product_type,
    imagePath,
    product.user_id,
    req.params.id,
  ];

  client.query(updateQuery, queryParams, (err, result) => {
    if (!err) {
      res.send("Update was successful");
    } else {
      console.log(err.message);
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
