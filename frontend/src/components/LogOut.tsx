import httpClient from "../httpClient";
import { useNavigate } from "react-router-dom";

export function LogOut() {
  const navigation = useNavigate();

  const logout = async () => {
    const respose = await httpClient.get("/api/logout");
    console.log(respose);
    navigation("/Login");
  };

  return (
    <button type="button" onClick={logout}>
      Log Out
    </button>
  );
}
