import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

const columns = [
  { field: 'id_employee', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name',width: 150,
    renderCell: (params) => {
      const employeeId = params.row.id_employee;
      const employeeName = params.value;
  
      return (
        <Link to={`/employee/${employeeId}`}>{employeeName}</Link>
      );
    },
  },
  
  { field: 'months_left', headerName: 'Prediction (Months)', width: 200 },
  { field: 'risk', headerName: 'Risk Profile', width: 150 },
  { field: 'job_level', headerName: 'Job Level', width: 150 },
  { field: 'role', headerName: 'Position', width: 150 },
  { field: 'satisfaction', headerName: 'Job Satisfaction', width: 150 },
  { field: 'life_balance', headerName: 'Worklife Balance',width: 150,
    renderCell: (params) => {
      const value = params.value;
      let backgroundColor  = '';

      switch (value) {
        case 'Best':
            backgroundColor  = '#f1faee';
          break;
        case 'Better':
            backgroundColor  = '#457b9d';
          break;
        case 'Good':
            backgroundColor  = '#1d3557';
          break;
        case 'Bad':
            backgroundColor  = '#e63946';
          break;
        default:
            backgroundColor  = 'black';
          break;
      }

      return (
        <div className='dangerTag' style={{ backgroundColor }}>{value}</div>
      );
    },
  },
  { field: 'salary_hike', headerName: 'Salary', width: 150 },
];

export default function Table() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Lógica para obtener los datos de la base de datos o de una API
    fetch('https://prueba-server.onrender.com/employees')
      .then(response => response.json())
      .then(data => {
        const updatedRows = data.map((row, index) => ({ ...row, id: index + 1 }));
        setRows(updatedRows);
      })
      .catch(error => console.log(error));
  }, []);
  

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </div>
  );
}
