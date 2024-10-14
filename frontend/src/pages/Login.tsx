import { useState } from "react";
import httpClient from "../httpClient";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = async () => {
    const response = await httpClient.post("/api/login", {
      username: username,
      password: password,
    });
    const data = await response.data;
    if (data.status == "logged in") {
      navigate("/Admin");
    }
  };

  return (
    <>
      <input
        type="text"
        name="username"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      ></input>
      <br />
      <input
        type="text"
        name="username"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      ></input>
      <br />
      <button type="button" onClick={login}>
        Login
      </button>
    </>
  );
}
