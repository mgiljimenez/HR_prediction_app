import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const Dashboard = () => {
  const [plots, setPlots] = useState([]);
  const [atrittion, setAtrittion] = useState(0);
  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");
  console.log(token);
  useEffect(() => {
    fetch("https://api-hr-proyect.onrender.com/graphs", {
      method: "GET",
      headers: { token } 
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "llega la data");
        setPlots(data);
      })
      .catch((error) => console.log("error al obtener datos", error));
  }, []);

  if (!plots.length) return null;
  console.log(plots);
  return (
    <div
      className="content"
      style={{ justifyItems: "center", alignItems: "center" }}
    >
      <div className="graph" key={0} style={{ display: "flex" }}>
        <h2> Number of Attritions: {plots[4].attrition}</h2>
      </div>
      {plots.slice(0, 4).map((plot, index) => (
        <div className="graph" key={index + 1}>
          <Plot data={plot.data} layout={plot.layout} />
        </div>
      ))}
      <div>
        {" "}
        <button>TRAINING MODEL</button>
        <button>NEW PREDICTION</button>
      </div>
    </div>
  );
};

export default Dashboard;
