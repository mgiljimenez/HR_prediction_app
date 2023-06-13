import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import axios from "axios";
import Plot from "react-plotly.js";
import { FaCoins, FaStopwatch } from "react-icons/fa";
import { useParams } from "react-router-dom";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [plot, setPlot] = useState(0);
  // const [searchParams, setSearchParams] = useSearchParams();
  let { id } = useParams();

  async function test() {
    const res = await axios.get(
      `https://vivapharma-hr-backend.onrender.com/employees/${id}`
    );
    setEmployees(res.data);
    console.log(data);
  }

  function chartFunction() {
    fetch(
      `https://api-hr-proyect.onrender.com/db/graph/gauge?id=${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setPlot(data);
      });
  }

  useEffect(() => {
    test();
    chartFunction();
  }, []);

  function getColorClassName(satisfaction) {
    if (satisfaction === "Medium") {
      return "medium";
    } else if (satisfaction === "Low") {
      return "low";
    } else if (satisfaction === "High") {
      return "high";
    } else if (satisfaction === "Very High") {
      return "very-high";
    }

    return "";
  }
  function getColorClassName(involvement) {
    if (involvement === "Medium") {
      return "medium";
    } else if (involvement === "Low") {
      return "low";
    } else if (involvement === "High") {
      return "high";
    } else if (involvement === "Very High") {
      return "very-high";
    }

    return "";
  }
  function getColorClassName(environment) {
    if (environment === "Medium") {
      return "medium";
    } else if (environment === "Low") {
      return "low";
    } else if (environment === "High") {
      return "high";
    } else if (environment === "Very High") {
      return "very-high";
    }

    return "";
  }

  return (
    <div>
      {employees.map((employee) => (
        <div className="employeeContainer" key={employee.id}>
          <div className="UpContainer">
            <div className="employeeImage">
              <Avatar style={{ height: "100px", width: "100px" }}>
                {employee.name.substring(0, 2).toUpperCase()}
              </Avatar>
            </div>
            <div className="leftUp">
              <p>id: {employee.id_employee}</p>
              <p>hola {employee.income_ranking}</p>

              <p>{employee.name}</p>
              <p>{employee.department}</p>
              <p>{employee.role}</p>
              <p>Job Level: {employee.job_level}</p>
              <p>Education: {employee.education}</p>
            </div>
            <div className="rightUp">
              <div className="prediction" style={{ display: "flex" }}>
                <h4 className="risk">
                  PREDICTION RISK <br />
                  <span>{employee.risk}</span>
                </h4>
                <h4 className="month">
                  <br />
                  <span>Months Left {employee.months_left}</span>
                </h4>
              </div>
              <div className="cost-month">
                /// Añadir símbolo de la moneda
                <p>
                  <FaCoins style={{ width: "35px", height: "35px" }} />{" "}
                  Replacement Cost {employee.replacement_cost}
                </p>
                <p>
                  {" "}
                  <FaStopwatch style={{ width: "35px", height: "35px" }} />{" "}
                  Worklife Balance {employee.replacement_month}
                </p>
              </div>
            </div>
          </div>
          <div
            className="downContainer"
            style={{ display: "flex", justifyItems: "flex-end" }}
          >
            <div className="leftDown">
              <TableContainer
                component={Paper}
                style={{
                  backgroundColor: "transparent",
                  border: "2px #1d3557 solid",
                  borderRadius: "10px",
                  boxShadow: "8px 8px 10px 0px rgba(29,53,87,1)",
                }}
              >
                <Table sx={{ minWidth: 300 }} aria-label="simple table">
                  <TableBody>
                    <TableRow>
                      <TableCell
                        style={{ color: "#1d3557" }}
                        component="th"
                        scope="row"
                      >
                        Job Involving
                      </TableCell>
                      <TableCell
                        align="center"
                        className={getColorClassName(employee.involvement)}
                      >
                        {employee.involvement}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ color: "#1d3557" }}
                        component="th"
                        scope="row"
                      >
                        Environment
                      </TableCell>
                      <TableCell
                        align="center"
                        className={getColorClassName(employee.environment)}
                      >
                        {employee.environment}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ color: "#1d3557" }}
                        component="th"
                        scope="row"
                      >
                        Satisfaction
                      </TableCell>
                      <TableCell
                        align="center"
                        className={getColorClassName(employee.satisfaction)}
                      >
                        {employee.satisfaction}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ color: "#1d3557" }}
                        component="th"
                        scope="row"
                      >
                        Salary Status
                      </TableCell>
                      <TableCell
                        align="center"  className={getColorClassName(employee.income_ranking)}>
                     {employee.income_ranking}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="rightDown">
              <Plot data={plot.data} layout={plot.layout} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default Employee;
