import { useEffect, useState } from "react";
import { api } from "../components/UrlApi";

export default function HomePage() {
  const access_token = localStorage.getItem("access_token");
  const [characters, setCharacters] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [transformations, setTransformations] = useState([]);

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 bg-[url('background.jpg')] bg-cover bg-center bg-no-repeat">
        
    </div>
  );
}
