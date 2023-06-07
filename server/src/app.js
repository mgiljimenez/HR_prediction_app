const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const corsss = require("cors");
require('dotenv').config();

// RUTAS ----------------------------------
const employeesRouter = require("./routes/employees");
const usersRouter = require("./routes/users");

const app = express();
app.set("port", process.env.PORT || 4000);



app.use("/employees", employeesRouter);
app.use("/users", usersRouter);
app.use(cors({
  origin: '*'
  }));


// SERVER RUNNING--------------------------
app.listen(app.get("port"), () => {
  console.log("Server is running on port", app.get("port"));
});