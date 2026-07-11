import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { User, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import loginBg from "../../assets/bg.png";
import API from "../../api/axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await API.post("/api/auth/register", formData);
      if (response.data.success) {
        // Redirect to OTP verification with email as a query parameter
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err) {
      console.error(err);
      setServerError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-cover bg-center bg-no-repeat px-4 py-4 text-white flex items-center justify-center font-sans"
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >
      <div className="w-full max-w-[450px] relative overflow-hidden rounded-2xl border border-[#2d3446] bg-[#030336]/85 p-8 shadow-2xl">
        <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#cec2f0] to-transparent shadow-[0_0_15px_#7f5af0]" />

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
            Join <span className="bg-gradient-to-r from-[#7f5af0] to-[#ff7ad9] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,122,217,0.5)]">Altraverse</span>
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Create an account to start contributing to open source projects.
          </p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <User size={18} />
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-[#0b0e14]/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5af0] transition text-sm ${
                  errors.name ? "border-red-500/50" : "border-[#2d3446]"
                }`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-[#0b0e14]/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5af0] transition text-sm ${
                  errors.email ? "border-red-500/50" : "border-[#2d3446]"
                }`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <Lock size={18} />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-[#0b0e14]/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5af0] transition text-sm ${
                  errors.password ? "border-red-500/50" : "border-[#2d3446]"
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 active:scale-[0.98] transition-all rounded-lg font-medium text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <span>Sending OTP...</span>
            ) : (
              <>
                Get Verification Code <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-[#7f5af0] hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
