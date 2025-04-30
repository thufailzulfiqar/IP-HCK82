import { Link, NavLink, useNavigate } from "react-router";

export default function Navbar({ children }) {
  const navigate = useNavigate();

  async function handleLogout() {
    localStorage.removeItem("access_token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[url('background.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Navbar */}
      <div className="bg-base-100 shadow-sm">
        <div className="navbar max-w-screen-xl mx-auto px-4 justify-between">
          <div>
            <a className="btn btn-ghost text-xl">AmazingDragonBall!</a>
          </div>
          <div>
            <button className="btn btn-light border" onClick={handleLogout}>
              Logout <i className="bi bi-box-arrow-right ms-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
