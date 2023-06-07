const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const pool = require("../mysqlPool");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const isAdmin = require("../middlewares/isAdmin");
const isAuth = require("../middlewares/isAuth");

// Validación de datos para la ruta '/signup'
const validateSignupData = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

// Validación de datos para la ruta '/signin'
const validateSigninData = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

//SIGNUP----------------------------------------------------------------

router.post("/signup", bodyParser.json(),validateSignupData, async (req, res) => {
  const { name, password: passwordPlainText } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(passwordPlainText, salt);

    const sql =
      "INSERT INTO prueba.registro (usuario, contrasena) VALUES (?, ?)";
    await pool.query(sql, [name, password]);

    const newUser = {
      name,
    };

    const token = jwt.sign(newUser, "secretKey"); // Cambia 'secretKey' a tu clave secreta

    res.setHeader("access-control-expose-headers", "x-auth-token");
    res.setHeader("x-auth-token", token).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
});

//SIGNIN----------------------------------------------------------------

router.post('/signin', bodyParser.json(), validateSigninData, async (req, res) => {
    const { name, password: passwordPlainText } = req.body;
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const [rows] = await pool.query('SELECT * FROM prueba.registro WHERE usuario = ?', [name]);

      const user = rows[0];

      if (!user) {
        return res.status(401).json({ message: 'Usuario o contraseña incorrecta' });
      }

      const isUser = await bcrypt.compare(passwordPlainText, user.contrasena);
      if (!isUser) {
        return res.status(401).json({ message: 'Usuario o contraseña incorrecta' });
      }
  
      const token = jwt.sign({ name: user.name }, process.env['jwt_privateKey']); // Cambia 'secretKey' a tu clave secreta
  
      res.setHeader('access-control-expose-headers', 'x-auth-token');
      res.setHeader('x-auth-token', token).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el inicio de sesión' });
    }
  });

module.exports = router;
