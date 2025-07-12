import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoomCanvas from "./components/Canvas/RoomCanvas";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import ResetPassword from "./pages/ResetPassword";
import ChatPage from "./pages/ChatPage";

const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/authenticate" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/room/:id" element={<RoomCanvas />} />
          <Route path="/room/chat/:id" element={<ChatPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;
