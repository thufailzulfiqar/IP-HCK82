import { useState, useRef } from "react";
import { api } from "../components/UrlApi";
import Menu from "../components/Menu";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function FusionPage() {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const comparisonRef = useRef(null);
  const [fusionResult, setFusionResult] = useState(null);

  const handleFusion = async () => {
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  
    const result = await generateFusionImage(selectedCharacters, setIsLoading);
    if (result) {
      setFusionResult(result);
    }
  };

  const downloadFusionImage = (base64Data) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${base64Data}`;
    link.download = "fusion-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  async function fetchCharacters() {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  }

  function toggleCharacterSelection(character) {
    if (selectedCharacters.includes(character)) {
      setSelectedCharacters((prev) =>
        prev.filter((c) => c.id !== character.id)
      );
    } else if (selectedCharacters.length < 2) {
      setSelectedCharacters((prev) => [...prev, character]);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Limit Reached",
        text: "You can only select up to 2 characters for fusion.",
        confirmButtonText: "OK",
      });
    }
  }

  function compareCharacters() {
    if (selectedCharacters.length !== 2) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Selection",
        text: "Please select exactly 2 characters to proceed.",
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

  async function generateFusionImage(selectedCharacters, setIsLoading) {
    if (!selectedCharacters || selectedCharacters.length !== 2) {
      Swal.fire(
        "Error",
        "Please select exactly 2 characters to fuse.",
        "error"
      );
      return null;
    }

    try {
      setIsLoading(true); // Optional loading state
      const response = await api.post("/fusion", {
        character1: selectedCharacters[0],
        character2: selectedCharacters[1],
      });

      const fusionImage = response.data.image; // base64 image

      if (!fusionImage) {
        Swal.fire("Error", "No image data received from server.", "error");
        return null;
      }

      // Tampilkan hasil fusion dengan gambar lebih besar di SweetAlert2
      await Swal.fire({
        title: "Fusion Generated!",
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <img src="data:image/png;base64,${fusionImage}" alt="Fusion Image" style="width: 100%; max-width: 600px; height: auto; margin-bottom: 20px; border-radius: 10px;" />
            <button id="download-btn" class="swal2-confirm swal2-styled" style="background-color: #28a745; color: white; padding: 10px 20px; border-radius: 5px; font-size: 16px; margin-bottom: 10px;">
              Download Image
            </button>
            <button id="awesome-btn" class="swal2-confirm swal2-styled" style="background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
              Awesome
            </button>
          </div>
        `,
        showConfirmButton: false, // Hide default confirm button
        didOpen: () => {
          // Event listener untuk tombol download
          const downloadBtn = document.getElementById("download-btn");
          downloadBtn.addEventListener("click", () => {
            const link = document.createElement("a");
            link.href = `data:image/png;base64,${fusionImage}`;
            link.download = "fusion-image.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });

          // Event listener untuk tombol awesome
          const awesomeBtn = document.getElementById("awesome-btn");
          awesomeBtn.addEventListener("click", () => {
            // Reset data selected characters
            setSelectedCharacters([]);
            setComparisonData([]);

            // Scroll ke atas
            window.scrollTo({ top: 0, behavior: "smooth" });

            // Tutup SweetAlert2
            Swal.close();
          });
        },
      });

      return fusionImage; // bisa digunakan untuk keperluan lain (download, simpan, dsb)
    } catch (error) {
      console.error("Fusion generation error:", error);
      Swal.fire("Error", "Failed to generate fusion image", "error");
      return null;
    } finally {
      setIsLoading(false); // Set loading state off
    }
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
          Fusion Characters
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
            Fuse Selected Characters
          </button>
          <button
            onClick={resetComparison}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
          >
            Reset
          </button>
        </div>

        {isLoading && (
          <div className="text-center mt-4">
            <img src="/fusion.gif" alt="Loading..." className="mx-auto h-150" />
          </div>
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
                  delay: index * 0.1,
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
              Fusion Preview
            </h2>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={handleFusion}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Generate Fusion
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
