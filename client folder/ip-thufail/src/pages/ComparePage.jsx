import { useState, useRef } from "react";
import { api } from "../components/UrlApi";
import Menu from "../components/Menu";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function ComparePage() {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Tambahkan state isLoading
  const comparisonRef = useRef(null);

  async function fetchCharacters() {
    setIsLoading(true); // Set isLoading menjadi true saat mulai memuat
    try {
      let allCharacters = [];
      let currentPage = 1;
      let totalPages = 1;

      while (currentPage <= totalPages) {
        const response = await api.get(
          `/characters?page=${currentPage}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        const { items, meta } = response.data;
        allCharacters = [...allCharacters, ...items];
        totalPages = meta.totalPages;
        currentPage++;
      }

      setCharacters(allCharacters);
    } catch (error) {
      console.error("Error fetching characters:", error);
    } finally {
      setIsLoading(false); // Set isLoading menjadi false setelah selesai
    }
  }

  function toggleCharacterSelection(character) {
    if (selectedCharacters.includes(character)) {
      setSelectedCharacters((prev) =>
        prev.filter((c) => c.id !== character.id)
      );
    } else if (selectedCharacters.length < 5) {
      setSelectedCharacters((prev) => [...prev, character]);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Limit Reached",
        text: "You can only select up to 5 characters for comparison.",
        confirmButtonText: "OK",
      });
    }
  }

  function compareCharacters() {
    if (selectedCharacters.length < 2) {
      Swal.fire({
        icon: "warning",
        title: "Not Enough Characters",
        text: "Please select at least 2 characters to compare.",
        confirmButtonText: "OK",
      });
      return;
    }
    setComparisonData(selectedCharacters);

    setTimeout(() => {
      if (comparisonRef.current) {
        comparisonRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }

  function resetComparison() {
    setSelectedCharacters([]);
    setComparisonData([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-[url('/background.jpg')] bg-no-repeat bg-cover bg-center bg-fixed">
      <div className="w-full max-w-7xl px-4 mb-6">
        <Menu />
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Compare Characters
        </h1>
        <div className="sticky top-0 z-10 flex justify-center space-x-4 py-4 mb-4">
          <button
            onClick={fetchCharacters}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105"
          >
            Load Characters
          </button>
          <button
            onClick={compareCharacters}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Compare Selected Characters
          </button>
        </div>

        {isLoading && (
          <p className="text-white text-center mt-4">Loading characters...</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {!isLoading &&
            characters.map((character, index) => (
              <motion.div
                key={character.id}
                onClick={() => toggleCharacterSelection(character)}
                className={`cursor-pointer p-4 rounded-lg shadow-md ${
                  selectedCharacters.includes(character)
                    ? "bg-green-500"
                    : "bg-[#1E1E24]"
                } flex flex-col items-center`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.1, // Tambahkan delay untuk animasi bertahap
                }}
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className="object-contain w-full h-60 image-hover"
                />
                <h3 className="text-lg font-bold text-white mt-2 text-center">
                  {character.name}
                </h3>
              </motion.div>
            ))}
        </div>

        {comparisonData.length > 0 && (
          <div
            ref={comparisonRef}
            className="mt-10 bg-[#1E1E24] p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Comparison
            </h2>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {comparisonData.map((character) => (
                  <div
                    key={character.id}
                    className="bg-[#1E1E24] rounded-lg shadow-md p-4 text-center flex flex-col items-center"
                  >
                    <img
                      src={character.image}
                      alt={character.name}
                      className="object-contain w-full h-60 mx-auto image-hover"
                    />
                    <h3 className="text-lg font-bold text-white mt-2 text-center">
                      {character.name}
                    </h3>
                    <p className="text-yellow-400 text-center">
                      {character.race} - {character.gender}
                    </p>
                    <p className="text-sm mt-2 text-center">
                      <strong>KI:</strong> {character.ki}
                    </p>
                    <p className="text-sm text-center">
                      <strong>Max KI:</strong> {character.maxKi}
                    </p>
                    <p className="text-sm text-center">
                      <strong>Affiliation:</strong> {character.affiliation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={resetComparison}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
