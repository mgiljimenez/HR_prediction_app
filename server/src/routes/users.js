const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const pool = require("../mysqlPool");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const isAuth = require("../middlewares/isAuth");

// Validación de datos para la ruta '/signup'
const validateSignupData = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").notEmpty().withMessage("El email es obligatorio"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

// Validación de datos para la ruta '/signin'
const validateSigninData = [
  body("email").notEmpty().withMessage("El email es obligatorio"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const sql = "SELECT * FROM prueba.registro";
    const [rows] = await pool.query(sql);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(rows);
  } catch (error) {
    console.error("Error al ejecutar la consulta SQL:", error);
    res.status(500).json({ error: "Error al obtener los datos" });
  } finally {
    // pool.end(); // Cerrar conexión a la base de datos
  }
});

// SIGNUP
router.post(
  "/signup",
  bodyParser.json(),
  validateSignupData,
  async (req, res) => {
    const { name, password: passwordPlainText, email } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(passwordPlainText, salt);

      const sql =
        "INSERT INTO prueba.registro (usuario, contrasena, email) VALUES (?, ?, ?)";
      await pool.query(sql, [name, password, email]);

      const newUser = {
        name,
        email,
      };

      const token = jwt.sign(newUser, process.env.jwt_privateKey);

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("access-control-expose-headers", "x-auth-token");
      res.setHeader("x-auth-token", token).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al registrar el usuario" });
    } finally {
      // pool.end(); // Cerrar conexión a la base de datos
    }
  }
);

// SIGNIN
router.post(
  "/signin",
  bodyParser.json(),
  validateSigninData,
  async (req, res) => {
    const { email, password: passwordPlainText } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const [rows] = await pool.query(
        "SELECT * FROM prueba.registro WHERE email = ?",
        [email]
      );

      const user = rows[0];

      if (!user) {
        return res
          .status(401)
          .json({ message: "Usuario o contraseña incorrecta" });
      }

      const isUser = await bcrypt.compare(passwordPlainText, user.contrasena);
      if (!isUser) {
        return res
          .status(401)
          .json({ message: "Usuario o contraseña incorrecta" });
      }

      const token = jwt.sign(
        { email: user.email, id: user.id },
        process.env.jwt_privateKey
      );

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, X-Auth-Token"
      );
      res.setHeader("Access-Control-Expose-Headers", "X-Auth-Token");
      res.setHeader("x-auth-token", token);

      res.json({ message: "Inicio de sesión exitoso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el inicio de sesión" });
    } finally {
      // pool.end(); // Cerrar conexión a la base de datos
    }
  }
);

// UPDATE USER SETTINGS
router.put("/settings", isAuth, bodyParser.json(), async (req, res) => {
  console.log(req.body);
  console.log(req.user);

  const { notification1, notification2, notification3 } = req.body;

  try {
    const [rows] = await pool.query(
      "UPDATE registro SET Notificacion1 = ?, Notificacion2 = ?, Notificacion3 = ? WHERE id = ?",
      [notification1, notification2, notification3, req.user.id]
    );

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );

    res.status(200).json({ message: "Configuración de usuario actualizada" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al actualizar la configuración del usuario" });
  } finally {
    // pool.end(); // Cerrar conexión a la base de datos
  }
});

// GET USER DATA
router.get("/account", isAuth, bodyParser.json(), async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM registro WHERE id = ?", [
      req.user.id,
    ]);

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los datos del usuario" });
  } finally {
    // pool.end(); // Cerrar conexión a la base de datos
  }
});

module.exports = router;