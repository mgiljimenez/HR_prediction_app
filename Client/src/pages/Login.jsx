import React from "react";
import Form from "../components/commons/Form";
import authService from "../services/authService";
// import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  // const [user, dispatch] = useAuth();
  const navigate = useNavigate();

  const handleLogin = (data) => {
    console.log('hola, soy login');
    console.log(data);
    // authService.login(data).then((decodedToken) => {
    //   dispatch({ type: "LOGIN", payload: decodedToken });
      navigate("/dashboard");
    // });
  };

  return (
    <div className="Container">
      <div className="loginContainer">
        <Form
          header={"Iniciar Sesión"}
          inputs={[
            { name: "email", label: "Email" },
            { name: "password", label: "Password", type: "password" },
          ]}
          submitLabel="Iniciar"
          onSubmit={handleLogin}
        />
      </div>
    </div>
  );
}

export default Login;
