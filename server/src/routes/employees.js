const express = require("express");
const router = express.Router();
const pool = require("../mysqlPool");

//GET EMPLOYEES

router.get("/", async (req, res) => {
  const sizePage = 500;
  let { page } = req.query;

  if (!page) page = 1;

  const offset = (page - 1) * sizePage;

  const sql =
    "SELECT * FROM replacement LIMIT " + sizePage + " OFFSET " + offset;
  const [rows, fields] = await pool.query(sql);

  res.setHeader('Access-Control-Allow-Origin','*').json(rows);
});

//GET ONEBYID

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM replacement WHERE id_employee = " + id;
  const [rows, fields] = await pool.query(sql);

  res.setHeader('Access-Control-Allow-Origin','*').json(rows);
});

//GET BY ROLE

router.get("/role/:role", async (req, res) => {
    const role = req.params.role;
    const sql = "SELECT * FROM replacement WHERE role = ?";
    const [rows, fields] = await pool.query(sql, [role]);
    res.setHeader('Access-Control-Allow-Origin','*').json(rows);
  });

//GET BY NAME

router.get("/name/:name", async (req, res) => {
    const name = req.params.name;
    const sql = "SELECT * FROM replacement WHERE name =?";
    const [rows, fields] = await pool.query(sql, [name]);
    res.setHeader('Access-Control-Allow-Origin','*').json(rows);
  });

  // //GET BY NUMBER OF ATTRITION FOR NEXT 24 MONTHS
  // router.get("/attrition", async (req, res) => {
  //   try {
  //     const sql = "SELECT COUNT(months_left) as total_filas FROM prueba.replacement WHERE months_left < 25 AND months_left > -1";
  //     const [rows, fields] = await pool.query(sql);
  //     console.log(rows[0]);
  //     const attrition = rows[0].total_filas;
  //     res.setHeader('Access-Control-Allow-Origin', '*').json({ attrition });
  //   } catch (error) {
  //     res.status(500).json({ error: "Error en la consulta SQL" });
  //   }
  // });



module.exports = router;