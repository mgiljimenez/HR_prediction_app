import React from "react";
import Form from "../components/commons/Form";
import authService from "../services/authService";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [user, dispatch] = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    console.log(data);
console.log(authService.getUser)
    const decodedJWT = await authService.login(data);
  
    console.log(decodedJWT);
    dispatch({ type: "LOGIN", payload: decodedJWT });
    navigate("/dashboard")

  };
  return (
    <div className="Container">
      <div className="loginContainer">
        <Form
          header={"Iniciar Sesión"}
          submitLabel="Iniciar"
          onSubmit={handleLogin}
          inputs={[
            { name: "email", label: "Email" },
            { name: "password", label: "Password", type: "password" },
          ]}
        />
      </div>
    </div>
  );
}

export default Login;
