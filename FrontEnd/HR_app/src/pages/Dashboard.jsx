
// import React, { useState, useEffect } from 'react';
// import Plot from 'react-plotly.js';

// const Dashboard = () => {
//     const [plot, setPlot] = useState(0);
//     const [atrittion, setAtrittion] = useState([]);

//     useEffect(() => {
//             fetch('https://api-hr-proyect.onrender.com/db/attrition24')
//           .then(res => res.json())
//           .then(data => setAtrittion(data));
//         }, [atrittion]);
// console.log();
//     useEffect(() => {
//       fetch('https://api-hr-proyect.onrender.com/db/graph/bar1').then(res => res.json()).then(data => {setPlot(data);});
//     }, []);
    
//     return (
//       <div className='content'>
//       <h1>Current Fund</h1>
//       <Plot data={plot.data} layout={plot.layout}/>
//       <h1>Number of Attrition: {atrittion}</h1>
//       </div>
//     );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
const Dashboard = () => {
  const [plots, setPlots] = useState([]);
    const [atrittion, setAtrittion] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response1 = await fetch('https://api-hr-proyect.onrender.com/db/graph/line');
      const data1 = await response1.json();
      const response2 = await fetch('https://api-hr-proyect.onrender.com/db/graph/pie');
      const data2 = await response2.json();
      const response3 = await fetch('https://api-hr-proyect.onrender.com/db/graph/bar1');
      const data3 = await response3.json();
      const response4 = await fetch('https://api-hr-proyect.onrender.com/db/graph/bar2');
      const data4 = await response4.json();
      setPlots([data1, data2, data3,data4]);
    };
    fetchData();
  }, []);

    useEffect(() => {
            fetch('https://api-hr-proyect.onrender.com/db/attrition24')
          .then(res => res.json())
          .then(data => setAtrittion(data));
        }, [atrittion]);

  return (
    <div className='content'>
      <h1>GRAFICAS</h1><h1>Number of Attrition: {atrittion}</h1>
      {plots.map((plot, index) => (
        <Plot key={index} data={plot.data} layout={plot.layout} />
        
      ))}
    </div>
  );
};
export default Dashboard;