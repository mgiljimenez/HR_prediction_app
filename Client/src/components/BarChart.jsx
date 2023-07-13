import React from 'react';
import Plot from 'react-plotly.js';


const BarChart = () => {
    const data = [
      {
       x: ["Alabama","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Virginia","Washington","Wisconsin"],
        y: [6139.09,8295.235,6302.6900000000005,91303.531,6502.294000000001,2794.02,4786.03,34248.2605,4540.1,465.216,16202.707,2936.81,1190.84,1319.79,8280.460000000001,2534.92,617.12,1701.25,9900.106,6172.251,15883.330000000002,2055.16,1648.03,424.488,210.01999999999998,2561.21,504.48,4192.28,708.012,64788.487,8620.741,14134.85,2639.35,4807.783,20246.148,5015.686,2270.8599999999997,162.15,3051.512,50625.1766,2943.688,25802.05,29871.576,4847.71],
        type: 'bar',
      },
    ];
  
    const layout = {
      title: 'Ventas por estado',
      xaxis: {
        title: 'Estado',
      },
      yaxis: {
        title: 'Ventas',
      },
    };
  
    return <Plot data={data}
    
     layout={layout} />;
  };
  

export default BarChart;