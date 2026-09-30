import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { validateUSN } from "../../utils/validateUSN";
import api from "../../services/api";

const branches = [
  {
    name: "Artificial Intelligence & Machine Learning",
    code: "AI",
  },
  {
    name: "Civil Engineering",
    code: "CV",
  },
  {
    name: "CSE (IoT & Cyber Security including Blockchain Tech)",
    code: "IC",
  },
  {
    name: "Computer Science & Engineering",
    code: "CS",
  },
  {
    name: "CSE (Data Science)",
    code: "DS",
  },
  {
    name: "Electrical & Electronics Engineering",
    code: "EE",
  },
  {
    name: "Electronics & Communication Engineering",
    code: "EC",
  },
  {
    name: "Mechanical Engineering",
    code: "ME",
  },
];

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "",
    admissionYear: "",
    usn: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear previous messages when the user edits the form.
    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Validate USN
    const result = validateUSN(
      formData.usn,
      formData.branch,
      formData.admissionYear
    );

    if (!result.valid) {
      setError(result.message);
      return;
    }

    // Validate required branch
    if (!formData.branch) {
      setError("Please select your branch.");
      return;
    }

    // Validate admission year
    if (!formData.admissionYear) {
      setError("Please enter your year of admission.");
      return;
    }

    // Validate password
    if (!formData.password) {
      setError("Please enter a password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),

        // validateUSN normalizes the USN to uppercase.
        usn: result.normalizedUSN,

        // Send branch code to backend.
        branch: result.branchCode,

        // Backend expects "year", not "admissionYear".
        year: Number(formData.admissionYear),

        password: formData.password,
      });

      setSuccess(
        response.data.message || "Account created successfully."
      );

      // Clear the form after successful registration.
      setFormData({
        name: "",
        email: "",
        branch: "",
        admissionYear: "",
        usn: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong while creating your account.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">

        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to CampusFind
        </Link>

        {/* Signup card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Join CampusFind
            </p>

            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Create your campus identity to report, discover, and reunite
              lost belongings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
              />
            </div>

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

            {/* Branch */}
            <div>
              <label
                htmlFor="branch"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Branch
              </label>

              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
              >
                <option value="" disabled>
                  Select your branch
                </option>

                {branches.map((branch) => (
                  <option key={branch.code} value={branch.code}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Admission Year */}
            <div>
              <label
                htmlFor="admissionYear"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Year of admission
              </label>

              <input
                id="admissionYear"
                type="text"
                name="admissionYear"
                value={formData.admissionYear}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={4}
                placeholder="Example: 2024"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
              />

              <p className="mt-2 text-xs text-slate-500">
                Example: If your USN contains <strong>24</strong>, enter{" "}
                <strong>2024</strong>.
              </p>
            </div>

            {/* USN */}
            <div>
              <label
                htmlFor="usn"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                USN
              </label>

              <input
                id="usn"
                type="text"
                name="usn"
                value={formData.usn}
                onChange={handleChange}
                placeholder="Example: 1CD24IC063"
                maxLength={10}
                autoComplete="off"
                className={`w-full rounded-2xl border bg-slate-900/70 px-4 py-3.5 uppercase text-white outline-none transition placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-400/10 ${
                  error.toLowerCase().includes("usn")
                    ? "border-red-400/50 focus:border-red-400/50"
                    : "border-white/10 focus:border-indigo-400/50"
                }`}
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Format: 1CD + admission year + branch code + 3-digit student
                number.
              </p>
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
                placeholder="Create a password"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
              />
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-300"
              >
                {error}
              </motion.div>
            )}

            {/* Success message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm leading-6 text-emerald-300"
              >
                {success}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-white px-6 py-4 font-semibold text-slate-900 shadow-xl shadow-white/10 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </motion.button>
          </form>

          {/* Login */}
          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-400 transition hover:text-indigo-300"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;