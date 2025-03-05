import { Route, Routes } from "react-router-dom";

import { io } from "socket.io-client";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

const socket = io("http://localhost:3000/");

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard socket={socket} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
