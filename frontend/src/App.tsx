import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoomCanvas from "./components/Canvas/RoomCanvas";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/authenticate" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room/:id" element={<RoomCanvas />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
