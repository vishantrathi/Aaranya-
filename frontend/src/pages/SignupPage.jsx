import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, Leaf, Phone, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await signup(formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-md relative"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-10 max-h-[90vh] overflow-y-auto">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              AARANYA
            </h1>
            <p className="text-primary-300 text-sm mt-1">Join Our Community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-primary-200 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-primary-400 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all text-sm"
                  placeholder="Raj Kumar"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-primary-200 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-primary-400 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all text-sm"
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-primary-200 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-primary-400 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all text-sm"
                  placeholder="At least 6 characters"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  disabled={loading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-primary-200 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-primary-400 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all text-sm"
                  placeholder="9876543210"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-primary-200 mb-1.5">Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-primary-400 flex-shrink-0" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-primary-400 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all text-sm resize-none"
                  placeholder="Street address, city, postal code"
                  rows="2"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-200 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-primary-300 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
              Sign in
            </Link>
          </p>

          <p className="text-center text-primary-400 text-xs mt-4 leading-relaxed">
            We'll use your details for delivery and support. Your data is secure and never shared.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
