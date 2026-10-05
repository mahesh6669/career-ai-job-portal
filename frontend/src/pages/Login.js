import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const formData = new FormData();

    formData.append("username", email);
    formData.append("password", password);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        formData
      );

      console.log(response.data);

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      alert("Login Successful");
window.location.href = "/dashboard"; 
    } catch (error) {
      console.log("ERROR:", error.response?.data);
      alert("Login Failed");
    }
  };

  return (
  <div className="container">
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">

        <div className="card shadow p-4">

          <h2 className="text-center mb-4">
            CareerAI Login
          </h2>

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="btn btn-primary w-100"
            onClick={handleLogin}
          >
            Login
          </button>
          <p className="mt-3 text-center">
  Don't have an account?

  <span
    style={{
      color: "blue",
      cursor: "pointer",
      marginLeft: "5px"
    }}
    onClick={() => navigate("/register")}
  >
    Register
  </span>
</p>

        </div>

      </div>
    </div>
  </div>
);
}

export default Login;