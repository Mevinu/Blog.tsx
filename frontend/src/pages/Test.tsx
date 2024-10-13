import { useEffect, useState } from "react";
import httpClient from "../httpClient";

export function Test() {
  const [user, setUser] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get("//127.0.0.1:5000/admin");
        setUser(resp.data);
      } catch (error) {
        console.log("Not authenticated");
      }
    })();
  }, []);

  return <div>{user ? <h1>Logged in</h1> : <h1>Please log in </h1>}</div>;
}
