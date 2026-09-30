import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../../services/api";

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

function ReportLost() {
  const navigate = useNavigate();

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
        type: "LOST",
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        location: formData.location,
        date: formData.date,
      });

      setSuccess(
        response.data.message || "Lost item reported successfully."
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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Lost Item
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Report something you lost
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            Give us enough details to help CampusFind identify potential
            matches with items reported as found.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-2xl backdrop-blur-xl sm:p-10"
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
              placeholder="Example: Black AirPods Pro"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the item in detail. Mention colour, brand, marks, stickers, case, or anything that makes it unique."
              className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
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
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
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
              Where did you lose it?
            </label>

            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
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
              Date lost
            </label>

            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
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
            className="w-full rounded-2xl bg-white px-6 py-4 font-semibold text-slate-900 shadow-xl shadow-white/10 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Reporting item..." : "Report Lost Item"}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}

export default ReportLost;