import React, { useEffect, useState } from "react";
import employeeService from "../services/employeeService";
import axios from "axios";

function Employee() {
  const [employees, setEmployees] = useState([]);

  // function test() {
  //   fetch('http://localhost:4000/employees')
  //     .then((res) => res.json())
  //     .then((response) => setEmployees(response));
  // }
  async function test() {
    // const res = await axios.get("http://localhost:4000/employees");
    const res = await axios.get('https://prueba-server.onrender.com/employees');
    setEmployees(res.data);
  }
  useEffect(() => {
    test();
  }, []);

  return (
    <div>
      <h1>PINTATE YA</h1>
      {employees.map((employee) => (
        <div className="employeeContainer" key={employee.id}>
          <div
          className="UpContainer" style={{display:'flex', }}>
            <div className='employeeImage'>
            <img src="profile.png" alt="" />
            </div>
            <div className="leftUp" >
            {" "}
            <p>id: {employee.id_employee}</p>
            <p>Name: {employee.name}</p>
            <p>Department: {employee.department}</p>
            <p>Role: {employee.role}</p>
            <p>Job Level: {employee.job_level}</p>
            <p>Education: {employee.education}</p>
          </div>
          <div className="rightUp">
            <div className="prediction" style={{display:'flex', }}>
            <h4 className="risk">PREDICTION RISK <br />{employee.risk}</h4>
            <h4 className="month">PREDICTION (MONTHS) <br />{employee.replacement_month}</h4>
            </div>
            <div className="cost-month">
              <h5>Replacement Cost {employee.replacement_cost}</h5>
              <h5>Months Left {employee.months_left}</h5>
            </div>
           
          </div>
          </div>
          <div className="downContainer" style={{display:'flex',justifyItems:'flex-end' }}>
            <div className="leftDown">
              <p>Job Involving {employee.involvement}</p>
              <p>Enovironment: {employee.environment}</p>
              <p>Satisfation: {employee.satisfaction}</p>
              <p>Salary: {employee.salary_hike}</p>
            </div>
            <div className="rightDown">
              <h4>Life Balance : {employee.life_balance}</h4>
            </div>
          </div>
          

        </div>
      ))}
    </div>
  );
}

export default Employee;
