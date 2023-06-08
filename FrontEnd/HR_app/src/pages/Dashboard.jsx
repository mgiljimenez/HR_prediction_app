
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const Dashboard = () => {
    const [plot, setPlot] = useState(0);
    const [plot1, setPlot1] = useState(0);
    
    useEffect(() => {
      fetch('https://api-hr-proyect.onrender.com/db/graph/bar1').then(res => res.json()).then(data => {setPlot(data);});
      fetch('https://api-hr-proyect.onrender.com/db/graph/bar1').then(res => res.json()).then(data => {setPlot1(data);});
    
    }, []);
      
      console.log(plot)
    
    return (
      <div className='content'>
      <h1>Current Fund</h1>
      <Plot data={plot.data} layout={plot.layout}/>
      <Plot data={plot1.data} layout={plot1.layout}/>
      </div>
    );
};

export default Dashboard;