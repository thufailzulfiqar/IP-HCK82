import { useEffect, useState } from "react";
import { api } from "../components/UrlApi";
import Menu from "../components/Menu";
import PlanetCard from "../components/PlanetCard";

export default function PlanetPage() {
  const access_token = localStorage.getItem("access_token");
  const [planets, setPlanets] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    // Hanya fetch saat pertama kali mount (page 1)
    if (page === 1) {
      fetchPlanets(page, true);
    } else {
      fetchPlanets(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 0 &&
        !isLoading &&
        hasMore &&
        initialLoadDone
      ) {
        setPage((prev) => prev + 1);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore, initialLoadDone]);

  async function fetchPlanets(page, isInitial = false) {
    setIsLoading(true);
    try {
      const response = await api.get(`/planets?page=${page}&limit=5`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const newPlanets = response.data.items;
      setPlanets((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const filteredNew = newPlanets.filter((c) => !existingIds.has(c.id));
        return [...prev, ...filteredNew];
      });

      const meta = response.data.meta;
      setHasMore(meta.currentPage < meta.totalPages);
      if (isInitial) setInitialLoadDone(true); // trigger scroll listener only after page 1 is fully loaded
    } catch (error) {
      console.error("Error fetching planets:", error);
    } finally {
      setIsLoading(false);
      if (!isInitial) {
        setTimeout(() => {
          window.scrollBy({ top: 100, behavior: "smooth" });
        }, 100);
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-[url('/background.jpg')] bg-no-repeat bg-cover bg-center bg-fixed">
      <div className="w-full max-w-7xl px-4">
        <Menu />
      </div>
      <h1 className="text-3xl font-bold text-white mb-6 text-center mb-12">
        Planets
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {planets.map((planet) => (
          <PlanetCard key={planet.id} planet={planet} />
        ))}
      </div>

      {isLoading && (
        <div className="h-40" /> 
      )}

      {isLoading && (
        <p className="text-white mt-4">Loading more planets...</p>
      )}
      {!hasMore && (
        <p className="text-gray-400 mt-4">No more planets to load.</p>
      )}
    </div>
  );
}
