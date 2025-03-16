import { useState } from "react";

export default function SessionToken() {
  const getToken = () => {
    const userToken = localStorage.getItem("token");
    return userToken && userToken;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    localStorage.setItem("token", userToken);
    setToken(userToken);
    console.log("token saved");
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return {
    setToken: saveToken,
    token,
    removeToken,
  };
}
