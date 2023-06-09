export default function BasicTable({ jobInvolving, environment, satisfaction, salaryHike }) {
    const rows = [
      createData("Job Involving", jobInvolving),
      createData("Environment", environment),
      createData("Satisfaction", satisfaction),
      createData("Salary Hike", salaryHike),
    ];
  
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  