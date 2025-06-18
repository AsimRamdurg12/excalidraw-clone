import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoomCanvas from "./components/Canvas/RoomCanvas";
import Auth from "./pages/Auth";
import Home from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/authenticate" element={<Auth />} />

        <Route path="/room/:id" element={<RoomCanvas />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
