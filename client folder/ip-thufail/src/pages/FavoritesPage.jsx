import { useEffect, useState } from "react";
import CharCard from "../components/CharCard";
import Menu from "../components/Menu";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  const toggleFavorite = (character) => {
    const updated = favorites.filter((fav) => fav.id !== character.id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-[url('/background.jpg')] bg-no-repeat bg-cover bg-center bg-fixed">
      <div className="w-full max-w-7xl px-4">
        <Menu />
      </div>
      <h1 className="text-3xl font-bold text-white mb-6 text-center mb-12">
        My Favorite Characters
      </h1>
      {favorites.length === 0 ? (
        <p className="text-white text-center">
          You have no favorite characters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favorites.map((character) => (
            <CharCard
              key={character.id}
              character={character}
              onFavorite={toggleFavorite}
              isFavorited={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
