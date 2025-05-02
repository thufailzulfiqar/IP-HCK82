import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addFavorite, removeFavorite } from "../store/slices/FavoriteSlices";
import { api } from "../components/UrlApi";
import CharCard from "../components/CharCard";
import Menu from "../components/Menu";

export default function CharacterPage() {
  const access_token = localStorage.getItem("access_token");
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const favorites = useSelector((state) => state.favorites.items);
  const dispatch = useDispatch();

  const toggleFavorite = (character) => {
    const exists = favorites.find((fav) => fav.id === character.id);
    if (exists) {
      dispatch(removeFavorite(character));
    } else {
      dispatch(addFavorite(character));
    }
  };

  useEffect(() => {
    if (page === 1) {
      fetchCharacters(page, true);
    } else {
      fetchCharacters(page);
    }
  }, [page]);

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
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

  async function fetchCharacters(page, isInitial = false) {
    setIsLoading(true);
    try {
      const response = await api.get(`/characters?page=${page}&limit=5`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
  
      const newCharacters = response.data.items;
      setCharacters((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const filteredNew = newCharacters.filter((c) => !existingIds.has(c.id));
        return [...prev, ...filteredNew];
      });
  
      const meta = response.data.meta;
      setHasMore(meta.currentPage < meta.totalPages);
      if (isInitial) {
        setInitialLoadDone(true);
      } else {
        // Scroll ke bawah setelah data baru dimuat
        setTimeout(() => {
          window.scrollBy({ top: 500, behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      console.error("Error fetching characters:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-[url('/background.jpg')] bg-no-repeat bg-cover bg-center bg-fixed">
      <div className="w-full max-w-7xl px-4">
        <Menu />
      </div>
      <h1 className="text-3xl font-bold text-white mb-6 text-center mb-12">
        Characters
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {characters.map((character) => (
          <CharCard
            key={character.id}
            character={character}
            onFavorite={toggleFavorite}
            isFavorited={favorites.some((fav) => fav.id === character.id)}
          />
        ))}
      </div>

      {isLoading && <div className="h-40" />}
      {isLoading && <p className="text-white mt-4">Loading more characters...</p>}
      {!hasMore && <p className="text-gray-400 mt-4">No more characters to load.</p>}
    </div>
  );
}
