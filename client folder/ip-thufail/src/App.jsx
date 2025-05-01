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
import CharacterPage from "./pages/CharacterPage";
import CharByIdPage from "./pages/CharByIdPage";
import PlanetPage from "./pages/PlanetPage";
import PlanetByIdPage from "./pages/PlanetByIdPage";
import TransformPage from "./pages/TransformPage";
import ComparePage from "./pages/ComparePage";
import FavoritesPage from "./pages/FavoritesPage";
import FusionPage from "./pages/FusionPage";
import EditProfilePage from "./pages/EditProfilePage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/characters" element={<CharacterPage />} />
          <Route path="/characters/:id" element={<CharByIdPage />} />
          <Route path="/planets" element={<PlanetPage />} />
          <Route path="/planets/:id" element={<PlanetByIdPage />} />
          <Route path="/transformations" element={<TransformPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/fusion" element={<FusionPage/>} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
