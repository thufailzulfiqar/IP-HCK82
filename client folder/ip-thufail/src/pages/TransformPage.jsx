import { useEffect, useState } from "react";
import { api } from "../components/UrlApi";
import CharCard from "../components/CharCard";
import Menu from "../components/Menu";
import TransformCard from "../components/TransformCard";

export default function TransformPage() {
  const access_token = localStorage.getItem("access_token");
  const [transformations, setTransformations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTransformations() {
      try {
        const response = await api.get("/transformations", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        setTransformations(response.data); // API langsung mengembalikan array, bukan { items: [...] }
      } catch (error) {
        console.error("Error fetching transformations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransformations();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-[url('/background.jpg')] bg-no-repeat bg-cover bg-center bg-fixed">
      <div className="w-full max-w-7xl px-4">
        <Menu />
      </div>
      <h1 className="text-3xl font-bold text-white mb-6 text-center mb-12">
        Transformations
      </h1>
      {isLoading ? (
        <p className="text-white">Loading transformations...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {transformations.map((transformation) => (
            <TransformCard key={transformation.id} transformation={transformation} />
          ))}
        </div>
      )}
    </div>
  );
}
