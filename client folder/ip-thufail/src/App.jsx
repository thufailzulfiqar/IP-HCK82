import { useState } from "react";
import "./App.css";
import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthLayout from "./layouts/AuthLayouts";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<HomePage />} />
          {/* <Route path="/my-coins" element={<MyCoinPage />} /> */}
          {/* <Route path="/update-my-coin/:id" element={<UpdateMyCoin />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
