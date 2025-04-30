import { useEffect, useState } from "react";
import { api } from "../components/UrlApi";
import Sidebar from "../components/Sidebar";

export default function HomePage() {
  const access_token = localStorage.getItem("access_token");
  const [characters, setCharacters] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [transformations, setTransformations] = useState([]);

  return (
    <div className="flex">
      <Sidebar />
    </div>
  );
}
