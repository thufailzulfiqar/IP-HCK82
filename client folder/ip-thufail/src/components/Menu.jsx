import { Link, NavLink, useNavigate } from "react-router";
export default function Menu() {
  return (
    <div className="flex justify-center items-center mb-6">
      <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box text-white font-semibold">
        <li>
          <Link to="/characters">Characters</Link>
        </li>
        <li>
          <Link to="/planets">Planets</Link>
        </li>
        <li>
          <Link to="/transformations">Transformations</Link>
        </li>
        <li>
          <Link to="/fusions">FunFusions!</Link>
        </li>
      </ul>
    </div>
  );
}
