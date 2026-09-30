import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const categories = [
  "Electronics",
  "Documents",
  "Wallet",
  "Keys",
  "Clothing",
  "Books",
  "Accessories",
  "Bags",
  "Other",
];

const locations = [
  "Cafeteria",
  "Main Ground",
  "Lawn",
  "Library",
  "Computer Lab",
  "Electronics Lab",
  "Mechanical Lab",
  "Classroom",
  "Parking Area",
  "Hostel",
  "Auditorium",
  "Other",
];

function ReportFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
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

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category ||
      !formData.location ||
      !formData.date
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/items", {
        type: "FOUND",
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        location: formData.location,
        date: formData.date,
      });

      setSuccess(
        response.data.message || "Found item reported successfully."
      );

      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        date: "",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong while reporting the item.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        {/* Back */}
        <Link
          to="/dashboard"
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Found Item
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Report something you found
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            Help a fellow student recover their belongings by providing
            accurate details about the item you found.
          </p>
        </motion.div>

        {/* Finder Information */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 rounded-3xl border border-emerald-400/10 bg-emerald-400/[0.03] p-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Finder Information
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Name
              </p>

              <p className="mt-2 font-medium">
                {user?.name || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                USN
              </p>

              <p className="mt-2 font-medium">
                {user?.usn || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Branch
              </p>

              <p className="mt-2 font-medium">
                {user?.branch || "—"}
              </p>
            </div>
          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            These details come from your CampusFind account and are not
            manually entered into the report.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          onSubmit={handleSubmit}
          className="mt-6 space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          {/* Item Name */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Item name
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Black Wallet"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Detailed description
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the item's colour, brand, markings, stickers, case, scratches, or other identifying details."
              className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
            >
              <option value="">Select a category</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Where did you find it?
            </label>

            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
            >
              <option value="">Select a campus location</option>

              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Date found
            </label>

            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
            />
          </div>

          {/* Notice */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
            <p className="text-xs leading-5 text-slate-500">
              By submitting this report, you confirm that you found the item
              and are providing the information honestly. CampusFind can use
              this report to identify potential matches.
            </p>
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

          {/* Success */}
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
            className="w-full rounded-2xl bg-emerald-400 px-6 py-4 font-semibold text-slate-950 shadow-xl shadow-emerald-400/10 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Reporting item..." : "Report Found Item"}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}

export default ReportFound;