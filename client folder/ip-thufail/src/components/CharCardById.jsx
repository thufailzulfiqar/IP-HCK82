    import { Link, useNavigate } from "react-router";
    import { api } from "../components/UrlApi";
    import Swal from "sweetalert2";
    import { motion } from "framer-motion";

    export default function CharacterCardById({ character }) {
    if (!character || !character.originPlanet || !character.transformations) {
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
            {/* Character Card */}
            <div className="flex bg-[#1E1E24] rounded-lg shadow-lg overflow-hidden w-full md:w-[610px]">
            <div className="w-1/2 p-4 flex justify-center items-center">
                <img
                src={character.image}
                alt={character.name}
                className="object-contain w-full h-120 image-hover"
                />
            </div>
            <div className="w-1/2 p-4 flex flex-col justify-center">
                <h2 className="text-2xl font-bold">{character.name}</h2>
                <p className="text-yellow-400">
                {character.race} - {character.gender}
                </p>
                <p className="text-sm mt-2">
                <strong>KI:</strong> {character.ki}
                </p>
                <p className="text-sm">
                <strong>Max KI:</strong> {character.maxKi}
                </p>
                <p className="text-sm">
                <strong>Affiliation:</strong> {character.affiliation}
                </p>
                <p className="text-xs mt-2 text-gray-300">
                {character.description}
                </p>
            </div>
            </div>

            {/* Planet Info */}
            <div className="flex bg-[#1E1E24] rounded-lg shadow-lg overflow-hidden w-full md:w-[610px]">
            <div className="w-1/2 p-4 flex justify-center items-center">
            <Link
                to={`/planets/${character.originPlanet.id}`}    
                className="bg-[#1E1E24] rounded-lg p-4 shadow-md text-center hover:scale-105 transition-transform duration-300"
              >
                <img
                src={character.originPlanet.image}
                alt={character.originPlanet.name}
                className="object-contain w-full h-64 image-hover"
                />
                </Link>
            </div>
            <div className="w-1/2 p-4 flex flex-col justify-center">
                <h3 className="text-xl font-bold">{character.originPlanet.name}</h3>
                <p className="text-sm text-gray-300">
                {character.originPlanet.description}
                </p>
            </div>
            </div>
        </div>

        {/* Transformations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
            {character.transformations.map((t) => (
            <div
                key={t.id}
                className="bg-[#1E1E24] rounded-lg p-4 shadow-md text-center"
            >
                <img
                src={t.image}
                alt={t.name}
                className="object-contain w-full h-60 mx-auto image-hover"
                />
                <h4 className="text-lg font-bold mt-2">{t.name}</h4>
                <p className="text-yellow-300">Ki: {t.ki}</p>
            </div>
            ))}
        </div>
        </motion.div>
    );
    }
