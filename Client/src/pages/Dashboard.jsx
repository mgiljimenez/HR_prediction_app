import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Center } from "@chakra-ui/react";

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const token = localStorage.getItem("token");
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["graphs"],
    queryFn: () =>
      axios
        .get("https://api-hr-proyect.onrender.com/graphs", {
          headers: { token },
        })
        .then((res) => {
          console.log(res.data);
          return res.data;
        }),

    staleTime: 4000,
  });

  /* funcion prediccion */

  const handlePredictionClick = () => {
    setMessage("Loading");
    fetch("https://api-hr-models.onrender.com/new_prediction", {
      headers: { token },
    })
    
      .then((response) => {
        console.log('1');
        
        return response.json();
      })
      .then((predictionData) => {
        console.log('2');
        console.log(predictionData);
        // Realiza cualquier acción adicional con los datos de predicción recibidos
        setMessage(predictionData.message);
       
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isFetching) {
    console.log("Haciendo fetching");
  }

  if (!data.length) return null;

  return (
    <div className="content">
      <div className="graph" key={0} style={{ display: "flex" }}></div>
     
      <div className="graph-containerUp" style={{ display: "block" }}>
        <div
          className={`graph graph-1`}
          key={1}
          style={{
            display: "flex",
            justifyContent: "center",
            marginRight: "200px",
            marginLeft: "200px",
          }}
        >
          <Plot data={data[0].data} layout={data[0].layout} />
          
          {/* <div className="attrition">
            <h3>Nº of Attritions: </h3>
            <h1 style={{ paddingLeft: "40px" }}>{data[4].attrition}</h1>
          </div> */}
        </div>
         { <h2 className="h2attrition"
         style={{ marginLeft: "540px", maxWidth: "315px", padding:'35px', backgroundColor:"rgba(218, 218, 218, 0.2)", borderRadius:"15px", color:"#1d3557"}}>
        Number of attritions : {data[4].attrition}{" "}
      </h2> }
        <div
          className={`graph graph-2`}
          key={2}
          style={{
            display: "flex",
            justifyContent: "center",
            marginRight: "450px",
          }}
          
        >
          <Plot data={data[1].data} layout={data[1].layout} />
          
        </div>
      </div>
      <div className="graph-container" style={{ display: "flex" }}>
        <div className={`graph graph-3`} key={3}>
          <Plot data={data[2].data} layout={data[2].layout} />
        </div>
        <div className={`graph graph-4`} key={4}>
          <Plot data={data[3].data} layout={data[3].layout} />
        </div>
      </div>

      <div
        className="predictionandtraining"
        style={{
          display: "grid",
          placeContent: "center",
          justifyContent: "center",
          marginBottom: "50px",
        }}
      >
        {message == "Loading" ? (
          <p>{message}</p>
        ) : message == "OK" ? (
          <p>DataBase Updated</p>
        ) : (
          ""
        )}
        <button
          onClick={handlePredictionClick}
          style={{ padding: "10px", backgroundColor: "transparent" }}
        >
          PREDICTION
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
