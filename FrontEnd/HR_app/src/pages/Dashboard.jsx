// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function Dashboard() {
//   // const [data, setData] = useState("");

//   // useEffect(() => {
//   //   axios
//   //     .get("https://dog.ceo/api/breeds/image/random")
//   //     .then((response) => {
//   //       setData(response.data.message);
//   //     })
//   //     .catch((error) => {
//   //       console.log(error);
//   //     });
//   // }, []);

//   return (
//     <div>
//       <h1>Aquí va la página principal</h1>

//     </div>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const Dashboard = () => {
    const [plot, setPlot] = useState(0);
    
    useEffect(() => {
      fetch('https://api-hr-proyect.onrender.com/db/graph/bar1').then(res => res.json()).then(data => {setPlot(data);});}, []);
      console.log(plot)
    
    return (
      <div className='content'>
      <h1>Current Fund</h1>
      <Plot data={plot.data} layout={plot.layout}/>
      </div>
    );
};

export default Dashboard;