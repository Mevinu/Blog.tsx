import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../httpClient";

export function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const [su, setSu] = useState(false);
  const [admin, setAdmin] = useState(false);
  const navigate = useNavigate();

  const checkUser = async () => {
    await httpClient
      .get("/api/checkuser")
      .then(function (response) {
        if (response.data.su) {
          setAdmin(true);
        }
      })
      .catch(function (error) {
        if (error.status == 401) {
          setAdmin(true);
        }
      });
  };

  const login = async () => {
    await httpClient
      .post("/api/createuser", {
        username: username,
        password: password,
        su: su,
      })
      .then(function (response) {
        if (response.status == 200) {
          navigate("/Admin");
        }
      })
      .catch(function (error) {
        if (error.response) {
          if (error.status == 409) {
            setWarning("Username already exists");
          } else if (error.status == 401) {
            setWarning("Unauthorized");
          }
        }
      });
  };

  useEffect(() => {
    checkUser();
  }, []);

  const onClick = () => {
    if (username.trim().length < 1 || password.trim().length < 1) {
      setWarning("Please fill all the fields");
    } else {
      login();
      setWarning("");
    }
  };

  return (
    <>
      {admin ? (
        <section className="flex-container centerd-flex">
          <div className="flex-container column-flex centerd-flex flex-gap30">
            <h2>Create User</h2>
            <div
              className="flex-container column-flex "
              style={{ gap: "10px" }}
            >
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
              <p>Super User</p>
              <div
                className="checkbox"
                style={
                  su
                    ? { backgroundColor: "black" }
                    : { backgroundColor: "white" }
                }
                onClick={() => {
                  su ? setSu(false) : setSu(true);
                }}
              ></div>

              <p className="warning">{warning}</p>
              <button
                type="button"
                onClick={onClick}
                className="button admin-button"
              >
                Create
              </button>
            </div>
          </div>
        </section>
      ) : (
        <h1>Unauthorized</h1>
      )}
    </>
  );
}
