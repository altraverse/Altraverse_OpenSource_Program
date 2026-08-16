import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Shield,
  KeyRound,
  CheckCircle2
} from "lucide-react";
import API from "../../api/axios";
import Navbar from "../../component/layout/Navbar";
import Footer from "../footer";
import { InteractiveNetworkBackground } from "../interactive-network-background";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: Reset Form, 3: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Enter a valid email address" });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await API.post("/api/auth/forgot-password", { email });
      if (response.data.success) {
        setStep(2);
      }
    } catch (err) {
      console.error(err);
      setServerError(
        err.response?.data?.message || "User with this email does not exist."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!otp.trim()) newErrors.otp = "Reset code is required";
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await API.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword
      });
      if (response.data.success) {
        setStep(3);
      }
    } catch (err) {
      console.error(err);
      setServerError(
        err.response?.data?.message || "Invalid or expired reset code."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06091b] text-white overflow-x-hidden selection:bg-indigo-500/30 relative flex flex-col justify-between">
      {/* Background Mesh Glow Layers */}
      <div
        className="absolute top-0 left-0 w-full h-[800px] pointer-events-none z-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 30% 20%, rgba(91,63,214,0.22) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[800px] h-[800px] pointer-events-none z-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 75%)",
        }}
      />

      {/* Interactive Network Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <InteractiveNetworkBackground />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 sm:px-6 lg:px-16 pt-32 pb-16">
        <main className="flex flex-1 flex-col items-center justify-center">
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full max-w-[440px] overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c102b]/40 p-8 sm:p-10 shadow-[0_20px_50px_rgba(99,102,241,0.15)] backdrop-blur-xl"
          >
            {/* Top Glowing Indicator Border */}
            <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent shadow-[0_0_20px_#6366f1]" />

            {/* Subtle Orb Glow inside Card */}
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none z-0" />

            <div className="relative z-10">
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Forgot Password</h2>
                  <p className="mt-2 text-sm text-slate-400 font-light">
                    Enter your email address to receive a secure password verification OTP code.
                  </p>

                  {serverError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                    >
                      {serverError}
                    </motion.div>
                  )}

                  <form onSubmit={handleSendOTP} className="mt-6 space-y-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Email Address
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                          <Mail size={18} />
                        </span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({});
                            setServerError("");
                          }}
                          className={`w-full pl-10 pr-4 py-3 bg-[#06091b]/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm text-white placeholder-slate-600 ${
                            errors.email ? "border-red-500/50" : "border-white/[0.08]"
                          }`}
                          placeholder="you@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 active:scale-[0.98] transition-all rounded-xl font-semibold text-white text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.35)]"
                    >
                      {isSubmitting ? "Sending Code..." : "Send Reset Code"}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 hover:underline transition"
                    >
                      <ArrowLeft size={16} /> Back to login
                    </Link>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Reset Password</h2>
                  <p className="mt-2 text-sm text-slate-400 font-light">
                    Enter the verification OTP code sent to <strong className="text-white/80">{email}</strong> and recreate your password.
                  </p>

                  {serverError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                    >
                      {serverError}
                    </motion.div>
                  )}

                  <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
                    {/* Reset Code */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Verification Code (6-Digit OTP)
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                          <Shield size={18} />
                        </span>
                        <input
                          type="text"
                          maxLength="6"
                          value={otp}
                          onChange={(e) => {
                            setOtp(e.target.value);
                            if (errors.otp) setErrors(prev => ({ ...prev, otp: "" }));
                            setServerError("");
                          }}
                          className={`w-full pl-10 pr-4 py-3 bg-[#06091b]/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm text-white placeholder-slate-600 font-mono tracking-widest ${
                            errors.otp ? "border-red-500/50" : "border-white/[0.08]"
                          }`}
                          placeholder="000000"
                        />
                      </div>
                      {errors.otp && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.otp}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        New Password
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                          <Lock size={18} />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: "" }));
                            setServerError("");
                          }}
                          className={`w-full pl-10 pr-10 py-3 bg-[#06091b]/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm text-white placeholder-slate-600 ${
                            errors.newPassword ? "border-red-500/50" : "border-white/[0.08]"
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.newPassword}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                          <KeyRound size={18} />
                        </span>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: "" }));
                            setServerError("");
                          }}
                          className={`w-full pl-10 pr-10 py-3 bg-[#06091b]/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm text-white placeholder-slate-600 ${
                            errors.confirmPassword ? "border-red-500/50" : "border-white/[0.08]"
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 active:scale-[0.98] transition-all rounded-xl font-semibold text-white text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.35)]"
                    >
                      {isSubmitting ? "Resetting Password..." : "Confirm & Reset"}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 hover:underline transition bg-transparent border-none cursor-pointer"
                    >
                      <ArrowLeft size={16} /> Request code again
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <div className="text-center py-4 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
                    <CheckCircle2 size={32} className="text-emerald-400" />
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Password Reset!</h2>
                  <p className="text-sm text-slate-400 font-light mb-8">
                    Your password has been successfully recreated. You can now log in using your new credentials.
                  </p>

                  <Link
                    to="/login"
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 active:scale-[0.98] transition-all rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(99,102,241,0.25)]"
                  >
                    Go to Login <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </motion.section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
