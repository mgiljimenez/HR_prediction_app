import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Dashboard = () => {

  const token = localStorage.getItem("token");
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["graphs"],
    queryFn: () =>
      axios
        .get("https://api-hr-proyect.onrender.com/graphs", {
          headers: { token },
        })
        .then((res) => {
          console.log('data ha llegado');
         return (res.data)
        }),

    staleTime: 4000 
    });

  if(isLoading) {
    return <div>Cargando...</div>
  }

if(isFetching) {
  console.log('Haciendo fetching');
}

  if (!data.length) return null;
  console.log(data);
  return (
    <div
      className="content"
      style={{ justifyItems: "center", alignItems: "center" }}
    >
      <div className="graph" key={0} style={{ display: "flex" }}>
        <h2> Number of Attritions: {data[4].attrition}</h2>
      </div>
      {data.slice(0, 4).map((plot, index) => (
        <div className="graph" key={index + 1}>
          <Plot data={plot.data} layout={plot.layout} />
        </div>
      ))}
      <div className="predictionandtraining">
        <button>TRAINING MODEL</button>
        <button>NEW PREDICTION</button>
      </div>
    </div>
  );
};

export default Dashboard;
