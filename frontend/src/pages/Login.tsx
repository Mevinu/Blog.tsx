import { useState } from "react";
import httpClient from "../httpClient";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const navigate = useNavigate();
  const login = async () => {
    await httpClient
      .post("/api/login", {
        username: username,
        password: password,
      })
      .then(function (response) {
        if (response.status == 200) {
          navigate("/Admin");
        }
      })
      .catch(function (error) {
        if (error.response) {
          if (error.status == 401) {
            if (error.response.data.error == "Invalied username") {
              setWarning("Invalied Username");
            } else {
              setWarning("Incorrect Password");
            }
          }
        }
      });
  };

  const onClick = () => {
    if (username.trim().length < 1 || password.trim().length < 1) {
      setWarning("Please fill all the fields");
    } else {
      login();
      setWarning("");
    }
  };

  return (
    <section className="flex-container centerd-flex">
      <div className="flex-container column-flex centerd-flex flex-gap30">
        <h2>Login</h2>
        <div className="flex-container column-flex " style={{ gap: "10px" }}>
          <p>Username</p>
          <input
            type="text"
            name="username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
          <p>Password</p>
          <input
            type="password"
            name="username"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <p className="warning">{warning}</p>
          <button
            type="button"
            onClick={onClick}
            className="button admin-button"
          >
            Login
          </button>
        </div>
      </div>
    </section>
  );
}
