import { Link, useNavigate } from "react-router";
import { api } from "../components/UrlApi";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function PlanetCardById({ planet }) {
  if (!planet || !planet.characters) {
    return <div className="text-white">Loading...</div>;
  }
  const access_token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 300 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.5,
        delay: 0.1,
      }}
    >
      <div className="flex flex-wrap gap-6 mt-8">
        {/* Planet Card */}
        <div className="flex bg-[#1E1E24] rounded-lg shadow-lg overflow-hidden w-full">
          <div className="w-1/2 p-4 flex justify-center items-center">
            <img
              src={planet.image}
              alt={planet.name}
              className="object-contain w-full h-120"
            />
          </div>
          <div className="w-1/2 p-4 flex flex-col justify-center">
            <h2 className="text-2xl font-bold">{planet.name}</h2>
            <p className="text-sm mt-2">
              <strong>Is Destroyed?:</strong>{" "}
              {planet.isDestroyed ? "Yes" : "No"}
            </p>
            <p className="text-xs mt-2 text-gray-300">{planet.description}</p>
          </div>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 w-full">
          {planet.characters.map((t) => (
            <div
              key={t.id}
              className="bg-[#1E1E24] rounded-lg p-4 shadow-md text-center"
            >
              <Link
                to={`/characters/${t.id}`}
                key={t.id}
                className="bg-[#1E1E24] rounded-lg p-4 shadow-md text-center hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={t.image}
                  alt={t.name}
                  className="object-contain w-full h-60 mx-auto image-hover"
                />
                </Link>
              <h4 className="text-lg font-bold mt-2">{t.name}</h4>
              <p className="text-yellow-400">
                {t.race} - {t.gender}
              </p>
              <p className="text-sm mt-2">
                <strong>KI:</strong> {t.ki}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
