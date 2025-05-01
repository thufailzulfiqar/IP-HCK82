import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../components/UrlApi";
import Menu from "../components/Menu";
import PlanetCardById from "../components/PlanetCardById";

export default function PlanetByIdPage() {
  const access_token = localStorage.getItem("access_token");
  const [planet, setPlanet] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  async function fetchPlanet(id) {
    try {
      const response = await api.get(`/planets/` + id, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setPlanet(response.data);
    } catch (error) {
      console.error("Error fetching planet:", error);
    }
  }
  useEffect(() => {
    if (params.id) {
      fetchPlanet(params.id);
    }
  }, [params.id]);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-[url('/background.jpg')] bg-no-repeat bg-cover bg-center bg-fixed">
      <div className="w-full max-w-7xl px-4 mb-6">
        <Menu />
        {planet && <PlanetCardById planet={planet} />}
      </div>
    </div>
  );
}
