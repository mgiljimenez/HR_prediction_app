const express = require("express");
const router = express.Router();
const pool = require("../mysqlPool");
const isAuth = require("../middlewares/isAuth")
// const isAdmin = require("../middleware/isAdmin");

//GET EMPLOYEES

router.get("/", isAuth, async (req, res) => {
  const sizePage = 3000;
  let { page } = req.query;

  if (!page) page = 1;

  const offset = (page - 1) * sizePage;

  const sql =
    "SELECT * FROM replacement LIMIT " + sizePage + " OFFSET " + offset;
  const [rows, fields] = await pool.query(sql);

  res.setHeader('Access-Control-Allow-Origin','*').json(rows);
});

//GET ONEBYID

router.get("/:id", isAuth, async (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM replacement WHERE id_employee = " + id;
  const [rows, fields] = await pool.query(sql);

  res.setHeader('Access-Control-Allow-Origin','*').json(rows);
});

//GET BY ROLE

router.get("/role/:role", isAuth, async (req, res) => {
    const role = req.params.role;
    const sql = "SELECT * FROM replacement WHERE role = ?";
    const [rows, fields] = await pool.query(sql, [role]);
    res.setHeader('Access-Control-Allow-Origin','*').json(rows);
  });

//GET BY NAME

router.get("/name/:name", isAuth, async (req, res) => {
    const name = req.params.name;
    const sql = "SELECT * FROM replacement WHERE name =?";
    const [rows, fields] = await pool.query(sql, [name]);
    res.setHeader('Access-Control-Allow-Origin','*').json(rows);
  });

module.exports = router;