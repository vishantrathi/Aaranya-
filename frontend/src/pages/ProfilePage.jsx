import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: auth?.name || "",
    email: auth?.email || "",
    phone: auth?.phone || "",
    address: auth?.address || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <section className="container section page-gap">
      <div className="section-heading">
        <h2>My Profile</h2>
        <p>View and manage your account information</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="glass-sm rounded-xl p-8 border border-white/20">
          {/* User Info */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-2 rounded-lg border border-secondary-300 bg-secondary-50 text-secondary-900 disabled:bg-secondary-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-secondary-300 bg-secondary-100 text-secondary-900 cursor-not-allowed"
              />
              <p className="text-xs text-secondary-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-2 rounded-lg border border-secondary-300 bg-secondary-50 text-secondary-900 disabled:bg-secondary-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!editing}
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-secondary-300 bg-secondary-50 text-secondary-900 disabled:bg-secondary-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 justify-end">
            {!editing ? (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all duration-200"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 rounded-lg bg-secondary-200 hover:bg-secondary-300 text-secondary-900 font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all duration-200"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
