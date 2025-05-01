import { useEffect, useState } from "react";
import { api } from "../components/UrlApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();
  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        setUser(response.data);
        setEmail(response.data.email);
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUser();
  }, [access_token]);

  async function handleEdit(e) {
    e.preventDefault();
    try {
      const response = await api.patch(
        "/users/edit",
        { email, username, password },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      Swal.fire("Success", response.data.message, "success");
      Navigate("/")
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to update profile.", "error");
    }
  }

  async function handleDelete() {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      });
  
      if (result.isConfirmed) {
        await api.delete(`/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
  
        Swal.fire("Deleted!", "Your account has been deleted.", "success");
  
        // Tambahkan penundaan sebelum pindah ke halaman login
        setTimeout(() => {
          localStorage.removeItem("access_token");
          window.location.href = "/login";
        }, 1500); // Penundaan 1.5 detik
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to delete account.", "error");
    }
  }

  if (!user) {
    return <p className="text-white text-center">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-[url('/background.jpg')] bg-no-repeat bg-cover bg-center bg-fixed">
      <div className="w-full max-w-2xl px-4">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Edit Profile
        </h1>
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="block text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-white">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-white">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}