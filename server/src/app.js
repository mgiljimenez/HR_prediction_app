const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const nodemailer = require("nodemailer");
const cron = require('node-cron');
const pool = require("./mysqlPool");
// RUTAS ----------------------------------
const employeesRouter = require("./routes/employees");
const usersRouter = require("./routes/users");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "vivapharmahr@gmail.com", // generated ethereal user
    pass: process.env.email_key // generated ethereal password
  }
});

async function sendEmail(email, body) {
  let info = await transporter.sendMail({
    from: '"VivaPharma.HR" <vivapharmahr@gmail.com>', // sender address
    to: email,
    subject: "Notificaciones VivaPharma.HR", // Subject line
    text: body, // plain text body
    //html: body, // html body
  });
} 

const app = express();
app.set("port", process.env.PORT || 4000);

// Middleware para configurar los encabezados CORS
app.use(cors());

app.use("/employees", employeesRouter);
app.use("/users", usersRouter);

// Esta función envía un correo que pasas como argumento
async function sendNotification(email, body) {
  try {
    await sendEmail(email, body);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
}

// Cada dos minutos envía un correo a los que tienen la Notificación activa
cron.schedule('*/2 * * * *', async () => {
  try {
    const [rows] = await pool.query("SELECT email FROM registro WHERE Notificacion2 = ?", [1]);

    rows.forEach(async (u) => {
      await sendNotification(u.email, "Subject: Risk of losing valuable employees: Act now! Recognize, engage, develop, and retain for a thriving workplace. Address concerns promptly.");
    });
  } catch (error) {
    console.error("Error al obtener los correos para enviar notificaciones:", error);
  }
});

// SERVER RUNNING--------------------------
app.listen(app.get("port"), () => {
  console.log("Server is running on port", app.get("port"));
});