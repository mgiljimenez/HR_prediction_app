const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();

// RUTAS ----------------------------------
const employeesRouter = require("./routes/employees");
const usersRouter = require("./routes/users");

const app = express();
app.set("port", process.env.PORT || 4000);

// Middleware para configurar los encabezados CORS
app.use(cors());

app.use("/employees", employeesRouter);
app.use("/users", usersRouter);

// SERVER RUNNING--------------------------
app.listen(app.get("port"), () => {
  console.log("Server is running on port", app.get("port"));
});