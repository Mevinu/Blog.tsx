import { useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../httpClient";

function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async () => {
    var content = { username: "mevinu", password: "vihansith" };
    const response = await httpClient.post("//127.0.0.1:5000/login", content);

    const coookies = response.headers["set-cookie"];
    console.log(response.data);
    console.log(coookies);
  };

  return (
    <>
      <input
        type="text"
        name="username"
        id="username"
        onChange={(element) => {
          setUserName(element.target.value);
        }}
      />
      <br />
      <input
        type="text"
        name="password"
        id="password"
        onChange={(element) => {
          setPassword(element.target.value);
        }}
      />
      <br />
      <button
        onClick={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        Login
      </button>
      <button
        onClick={(e) => {
          navigate("/test");
        }}
      >
        Login
      </button>
    </>
  );
}

export default Login;
