import { Link, useNavigate } from "react-router";
import { api } from "../components/UrlApi";
import Swal from "sweetalert2";

export default function CharacterCard({character}) {
  const access_token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const { name, ki, maxKi, race, gender, description, image, affiliation } =
    character;
  return (
    <div className="relative bg-[#1E1E24] rounded-lg shadow-lg text-white w-64 pt-20 m-4 overflow-visible group">
      <div className="relative -mt-20 w-full h-64 overflow-hidden">
  <img src={image} alt={name} className="w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105" />
</div>

      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{name}</h2>
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
      </div>
    </div>
  );
}
