import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import axios from 'axios'


const columns = [
  { field: "id_employee", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
    renderCell: (params) => {
      const employeeId = params.row.id_employee;
      const employeeName = params.value;
      return <Link to={`/employee/${employeeId}`}>{employeeName}</Link>;
    },
  },

  { field: "months_left", headerName: "Prediction (Months)", width: 200 },
  { field: "risk", headerName: "Risk Profile", width: 150 },
  { field: "job_level", headerName: "Job Level", width: 150 },
  { field: "role", headerName: "Position", width: 150 },
  {
    field: "satisfaction",
    headerName: "Job Satisfaction",
    width: 150,
    renderCell: (params) => {
      const value = params.value;
      let backgroundColor = "";

      switch (value) {
        case "Very High":
          backgroundColor = "#0F9D58";
          break;
        case "High":
          backgroundColor = "#FFFF00";
          break;
        case "Medium":
          backgroundColor = "#FABC09";
          break;
        case "Low":
          backgroundColor = "#DB4437";
          break;
        default:
          backgroundColor = "black";
          break;
      }

      return (
        <div className="dangerTag" style={{ backgroundColor }}>
          {value}
        </div>
      );
    },
  },
  {
    field: "life_balance",
    headerName: "Worklife Balance",
    width: 150,
    renderCell: (params) => {
      const value = params.value;
      let backgroundColor = "";

      switch (value) {
        case "Best":
          backgroundColor = "#0F9D58";
          break;
        case "Better":
          backgroundColor = "#FFFF00";
          break;
        case "Good":
          backgroundColor = "#FABC09";
          break;
        case "Bad":
          backgroundColor = "#DB4437";
          break;
        default:
          backgroundColor = "black";
          break;
      }

      return (
        <div className="dangerTag" style={{ backgroundColor }}>
          {value}
        </div>
      );
    },
  },
  {
    field: "income_ranking",
    headerName: "Salary Status",
    width: 150,
    renderCell: (params) => {
      const value = params.value;
      let backgroundColor = "";

      switch (value) {
        case "Very High":
          backgroundColor = "#0F9D58";
          break;
        case "High":
          backgroundColor = "#FFFF00";
          break;
        case "Medium":
          backgroundColor = "#FABC09";
          break;
        case "Low":
          backgroundColor = "#DB4437";
          break;
        default:
          backgroundColor = "black";
          break;
      }

      return (
        <div className="dangerTag" style={{ backgroundColor }}>
          {value}
        </div>
      );
    },
  },
];

export default function Table() {
  const [rows, setRows] = useState([]);

  useEffect(() => {

    axios("https://vivapharma-hr-backend.onrender.com/employees")
      .then(({data}) => {
        console.log(data);
        const updatedRows = data.map((row, index) => ({
          ...row,
          id: index + 1,
        }));
        setRows(updatedRows); 
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div style={{ height: 620, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        className="custom-table"
      />
    </div>
  );
}
