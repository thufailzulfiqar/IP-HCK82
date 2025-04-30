import { Link, useNavigate } from "react-router";
import { api } from "../components/UrlApi";
import Swal from "sweetalert2";

export default function CharacterCard({ character }) {
  const access_token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const { name, ki, maxKi, race, gender, image, affiliation } =
    character;
    
  return (
    <div className="relative bg-[#1E1E24] rounded-lg shadow-lg text-white w-64 pt-20 h-[550px] m-4 overflow-visible group">

      <div className="absolute top-30 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-80 z-10 transition-transform duration-1000 ease-in-out group-hover:scale-125">
        <img src={image} alt={name} className="w-full h-full object-contain" />
      </div>

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
            // onClick={handleAddFavorite}
            className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm py-1.5 px-3 rounded-lg shadow-md transition-all duration-300"
          >
            Favorites
          </button>
          <button
            onClick={() => navigate(`/characters/${id}/transformations`)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-3 rounded-lg shadow-md transition-all duration-300"
          >
            Transformations
          </button>
        </div>
        
      </div>
    </div>
  );
}
