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

async function sendEmailo(email, body) {
 
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






// Esta función envia a un correo que pasas como arguemnto



// Cada cinco segundos envia un correo a los que tienen la Notificación 2 activa
cron.schedule('* */5 * * * *', () => {

  async function sendNotificacione1() {
    const [rows] = await pool.query("SELECT email FROM registro WHERE Notificacion2 = ?", [1]);


    rows.forEach(u => {
    
      sendEmailo(u.email, "Esta es una notificación muy importante")
    })
  }

  sendNotificacione1()


  console.log('running a task every minute');
}).start()


// SERVER RUNNING--------------------------
app.listen(app.get("port"), () => {
  console.log("Server is running on port", app.get("port"));
});