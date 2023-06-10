
import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const Dashboard = () => {
  const [plots, setPlots] = useState([]);
  const [atrittion, setAtrittion] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response1 = await fetch(
        "https://api-hr-proyect.onrender.com/db/graph/line"
      );
      const data1 = await response1.json();
      const response2 = await fetch(
        "https://api-hr-proyect.onrender.com/db/graph/pie"
      );
      const data2 = await response2.json();
      const response3 = await fetch(
        "https://api-hr-proyect.onrender.com/db/graph/bar1"
      );
      const data3 = await response3.json();
      const response4 = await fetch(
        "https://api-hr-proyect.onrender.com/db/graph/bar2"
      );
      const data4 = await response4.json();
      setPlots([data1, data2, data3, data4]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetch("https://api-hr-proyect.onrender.com/db/attrition24")
      .then((res) => res.json())
      .then((data) => setAtrittion(data));
  }, []);

  return (
    <div
      className="content"
      style={{ justifyItems: "center", alignItems: "center" }}
    >
      <div className="graph" key={0} style={{ display: "flex" }}>
        {plots.length > 0 && (
          <Plot data={plots[0].data} layout={plots[0].layout} />
        )}{" "}
        <h3 className="attrition">
          Number of Attrition:
          <br /> <span>{atrittion}</span>{" "}
        </h3>
      </div>
      {plots.slice(1).map((plot, index) => (
        <div className="graph" key={index + 1}>
          <Plot data={plot.data} layout={plot.layout} />
        </div>
      ))}
    </div>
  );
};

export default Dashboard;