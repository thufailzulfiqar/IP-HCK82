import { Link, useNavigate } from "react-router";
import { api } from "../components/UrlApi";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function CharacterCard({ character, onFavorite, isFavorited }) {
  const access_token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const { name, ki, maxKi, race, gender, image, affiliation } = character;

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
      <div className="relative bg-[#1E1E24] rounded-lg shadow-lg text-white w-64 pt-20 h-[550px] m-4 overflow-visible group">
        <Link
          to={`/characters/${character.id}`}
          className="absolute inset-0 z-10"
        >
          <div className="absolute top-30 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-80 z-10 transition-transform duration-1000 ease-in-out group-hover:scale-125">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain"
            />
          </div>
        </Link>
        <div className="h-45"></div>

        <div className="relative z-20 p-4 pt-6 text-center mt-auto">
          <h2 className="text-xl font-bold mb-0">{name}</h2>
          <p className="text-yellow-400 font-semibold">
            {race} - {gender}
          </p>

          <p className="text-sm text-white mt-2">
            <span className="font-semibold text-gray-300">Base KI:</span>
            <br />
            <span className="text-yellow-300">{ki}</span>
          </p>

          <p className="text-sm text-white mt-2">
            <span className="font-semibold text-gray-300">Max KI:</span>
            <br />
            <span className="text-yellow-300">{maxKi}</span>
          </p>

          <p className="text-sm text-white mt-2">
            <span className="font-semibold text-gray-300">Affiliation:</span>
            <br />
            <span className="text-yellow-300">{affiliation}</span>
          </p>
          <div className="flex justify-center gap-2 pt-3">
            <button
              onClick={() => onFavorite(character)}
              className={`mt-2 px-4 py-1 rounded ${
                isFavorited
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-yellow-400 text-black hover:bg-yellow-500"
              } transition-all duration-300`}
            >
              {isFavorited ? "Unfavorite" : "+ Favorite"}
            </button>
          </div>
        </div>
      </div>
      {/* Card content */}
    </motion.div>
  );
}
