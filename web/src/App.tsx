import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/RegisterForm";
import Articles from "./pages/Articles";
import { ResetPassword } from "./pages/ResetPassword";
import { Dashboard } from "./pages/admin/Dashboard";
import { AddPharmacy } from "./pages/admin/AddPharmacy";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/log" element={<Articles />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/add-pharmacy" element={<AddPharmacy />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
