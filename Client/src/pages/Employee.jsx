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

  const token = localStorage.getItem("token")

  async function test() {
    const res = await axios.get(
      `https://vivapharma-hr-backend.onrender.com/employees/${id}`,
    );
    setEmployees(res.data);
    console.log(data);
  }

  // const token = localStorage.getItem("token");
  // console.log(token);
  // useEffect(() => {
  //   fetch("https://api-hr-proyect.onrender.com/graphs", {
  //     method: "GET",
  //     headers: { token } 
  //   })

  function chartFunction() {
    fetch(
      `https://api-hr-proyect.onrender.com/db/graph/gauge?id=${id}`, {method: "GET", headers:{ token } }
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
    <div className="personalCardContainer">
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
              <p>{employee.name}</p>
              <p>{employee.department}</p>
              <p>{employee.role}</p>
              <p>Job Level: {employee.job_level}</p>
              <p>Education: {employee.education}</p>
            </div>
            <div className="rightUp">
              <div className="prediction" style={{ display: "flex" }}>
                <div className="risk">
                 <h4>PREDICTION RISK</h4> 
                  <span>{employee.risk}</span>
                </div>
                <div className="month">
                  <br />
                  <h4><span>{employee.months_left} </span> <br />MONTHS LEFT</h4>
                </div>
              </div>
              <div className="cost-month">

                <div className="replacementCost">
                  <FaCoins style={{ width: "35px", height: "35px" }} />{" "}
                  Replacement Cost {employee.replacement_cost} €
                </div>
                <div className="replacementTime">
                  <FaStopwatch style={{ width: "35px", height: "35px" }} />{" "}
                Replacement Time {employee.replacement_month} Months
                </div>
              </div>
            </div>
          </div>
          <div
            className="downContainer"
            style={{ display: "flex", justifyItems: "flex-end" }}
          >
            <div className="leftDown">
              <TableContainer
              className="customTableContainer"
                component={Paper}
                style={{
                  backgroundColor: "transparent",
                  borderRadius: "10px",
                }}
              >
                <Table sx={{ minWidth: 300 }} aria-label="simple table">
                  <TableBody>
                    <TableRow>
                      <TableCell
                        style={{ color: "#1d3557"}}
                        component="th"
                        scope="row"
                      >
                        Job Involving
                      </TableCell>
                      <TableCell
                        align="center"
                        // style={{width :"100px"}}
                        className={getColorClassName(employee.involvement)} style={{borderRadius:'8px'}} >
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
                        className={getColorClassName(employee.environment)} style={{borderRadius:'8px'}}
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
                        className={getColorClassName(employee.satisfaction)} style={{borderRadius:'8px'}}
                      >
                        {employee.satisfaction}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ color: "#1d3557"}}
                        component="th"
                        scope="row"
                      >
                        Salary Status
                      </TableCell>
                      <TableCell
                        align="center"  className={getColorClassName(employee.income_ranking)} style={{borderRadius:'8px'}}>
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
