import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  setError("");

  if (!formData.email.trim() || !formData.password) {
    setError("Please enter your email and password.");
    return;
  }

  setLoading(true);

  try {
    await login(
      formData.email.trim().toLowerCase(),
      formData.password
    );

    navigate("/dashboard");
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Something went wrong while logging in.";

    setError(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[90vh] max-w-md items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              ← Back to CampusFind
            </Link>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Welcome Back
            </p>

            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              Login to CampusFind
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Sign in to report lost items, discover found belongings, and
              reconnect with your campus community.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                College email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@college.edu"
                autoComplete="email"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
              />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-300"
              >
                {error}
              </motion.div>
            )}

            {/* Login button */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-white px-6 py-4 font-semibold text-slate-900 shadow-xl shadow-white/10 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          {/* Signup */}
          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-indigo-400 transition hover:text-indigo-300"
            >
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;