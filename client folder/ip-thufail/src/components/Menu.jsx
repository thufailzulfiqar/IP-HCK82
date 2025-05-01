import { Link, NavLink, useNavigate } from "react-router";
export default function Menu() {
  return (
    <div className="flex justify-center items-center mb-6">
      <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box text-white font-semibold">
        <li>
          <Link to="/characters" className="text-lg lg:text-xl">Characters</Link>
        </li>
        <li>
          <Link to="/planets" className="text-lg lg:text-xl">Planets</Link>
        </li>
        <li>
          <Link to="/transformations" className="text-lg lg:text-xl">Transformations</Link>
        </li>
        <li>
          <Link to="/compare" className="text-lg lg:text-xl">Compare</Link>
        </li>
        <li>
          <Link to="/fusion" className="text-lg lg:text-xl">FunFusions!</Link>
        </li>
      </ul>
    </div>
  );
}
