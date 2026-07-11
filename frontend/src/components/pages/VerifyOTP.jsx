import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, RefreshCw, KeyRound } from "lucide-react";
import loginBg from "../../assets/bg.png";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function VerifyOTP() {
  const { setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve email from query parameters
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [timer, setTimer] = useState(59);

  // Countdown timer for OTP resending
  useEffect(() => {
    if (!email) {
      navigate("/register");
      return;
    }

    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6 || isNaN(Number(otp))) {
      setMessage({ text: "Please enter a valid 6-digit verification code.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await API.post("/api/auth/verify-otp", {
        email,
        otp,
      });

      if (response.data.success) {
        setMessage({ text: "Account verified successfully! Redirecting...", type: "success" });
        setUser(response.data.user);
        setTimeout(() => {
          navigate("/roles");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage({
        text: err.response?.data?.message || "Invalid or expired OTP. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    setResending(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await API.post("/api/auth/resend-otp", { email });
      if (response.data.success) {
        setMessage({ text: "A new OTP code has been sent to your email.", type: "success" });
        setTimer(59);
      }
    } catch (err) {
      console.error(err);
      setMessage({
        text: err.response?.data?.message || "Failed to resend OTP. Please try again.",
        type: "error",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-cover bg-center bg-no-repeat px-4 py-4 text-white flex items-center justify-center font-sans"
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >
      <div className="w-full max-w-[420px] relative overflow-hidden rounded-2xl border border-[#2d3446] bg-[#030336]/85 p-8 shadow-2xl">
        <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#cec2f0] to-transparent shadow-[0_0_15px_#7f5af0]" />

        <div className="mb-6">
          <Link to="/register" className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition mb-4">
            <ArrowLeft size={14} /> Back to Register
          </Link>
          
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Verify Email <KeyRound size={20} className="text-[#ff7ad9]" />
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            We sent a verification code to <span className="font-semibold text-white">{email}</span>.
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg border text-sm text-center ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Enter 6-Digit OTP
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-full text-center tracking-[1em] pl-[1em] py-3 bg-[#0b0e14]/50 border border-[#2d3446] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5af0] transition text-lg font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || otp.length !== 6}
            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 active:scale-[0.98] transition-all rounded-lg font-semibold text-white text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
          <span>Didn't get code?</span>
          <button
            type="button"
            disabled={timer > 0 || resending}
            onClick={handleResend}
            className="flex items-center gap-1 text-[#7f5af0] font-medium hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
          >
            {resending ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Sending...
              </>
            ) : timer > 0 ? (
              `Resend in ${timer}s`
            ) : (
              "Resend Code"
            )}
          </button>
        </div>

        {/* Informational tip about console logs during development */}
        <div className="mt-6 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-2 text-slate-400">
          <ShieldAlert size={16} className="text-indigo-400 shrink-0 mt-0.5" />
          <span className="text-[11px] leading-normal">
            <strong>Development mode:</strong> If you did not receive an email, please check the server terminal logs for the generated verification OTP.
          </span>
        </div>
      </div>
    </div>
  );
}
