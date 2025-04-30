import { Link, NavLink, useNavigate } from "react-router";

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      <div className="text-yellow-400 text-xl font-bold mb-8">
        ⚡ POKÉMON AWESOME!
      </div>

      <nav className="flex-1 space-y-6 text-sm">
        <div>
          <h2 className="text-gray-400 uppercase text-xs mb-2">Main Menu</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-yellow-300">
                Pokémons
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300">
                Compare
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300">
                Statistics
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300">
                Bookmarks
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-gray-400 uppercase text-xs mb-2">Pokémon Data</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-yellow-300">
                Evolutions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300">
                Types
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300">
                Egg Groups
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-gray-400 uppercase text-xs mb-2">
            Forms / Variations
          </h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-yellow-300">
                Gigantamax Forms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300">
                Mega Evolutions
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-gray-400 uppercase text-xs mb-2">Fun & Games</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-yellow-300">
                Guess the Pokémon
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300">
                Trading Card Game
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-gray-400 uppercase text-xs mb-2">Misc.</h2>
          <ul>
            <li>
              <a href="#" className="hover:text-yellow-300">
                About
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
