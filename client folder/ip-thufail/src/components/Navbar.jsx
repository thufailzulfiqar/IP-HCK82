import { Link, NavLink, useNavigate } from "react-router";

export default function Navbar({ children }) {
  const navigate = useNavigate();

  async function handleLogout() {
    localStorage.removeItem("access_token");
    window.google?.accounts.id.disableAutoSelect();
    navigate("/login");
  }

  return (
    <div className="bg-base-100 shadow-sm">
      <div className="navbar max-w-screen-xl mx-auto px-4 justify-between">
        <div className="flex-1 flex items-center gap-0">
          <Link to="/" className="btn btn-ghost text-xl px-1">
            <img src="/logo.png" alt="logo.png" className="w-8 h-8" />
            AmazingDragonBall!
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/about"
            className="text-sm text-base-content hover:underline"
          >
            ⓘ About
          </Link>
          <Link
            to="/favorites"
            className="text-sm text-base-content hover:underline"
          >
            ❤︎ Favorites
          </Link>
          <Link
            to="/edit-profile"
            className="text-sm text-base-content hover:underline"
          >
            ✎ Edit Profile
          </Link>
          <button
            className="btn text-sm bg-red-500 hover:bg-red-600 text-white border-none justify-center"
            onClick={handleLogout}
          >
            Logout <i className="bi bi-box-arrow-right ms-1"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
