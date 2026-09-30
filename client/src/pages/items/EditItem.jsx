import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";

function EditItem() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    contactPreference: "CHAT",
  });

  const [itemType, setItemType] = useState("");
  const [itemStatus, setItemStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get("/items/my-items");

        const foundItem = response.data.items.find(
          (item) => item._id === itemId
        );

        if (!foundItem) {
          setError("Item not found or you are not authorized to edit it.");
          return;
        }

        if (["RETURNED", "CLOSED"].includes(foundItem.status)) {
          setError("Returned or closed items cannot be edited.");
          setItemStatus(foundItem.status);
          return;
        }

        setItemType(foundItem.type);
        setItemStatus(foundItem.status);

        setFormData({
          title: foundItem.title || "",
          description: foundItem.description || "",
          category: foundItem.category || "",
          location: foundItem.location || "",
          date: foundItem.date
            ? new Date(foundItem.date).toISOString().split("T")[0]
            : "",
          contactPreference: foundItem.contactPreference || "CHAT",
        });
      } catch (error) {
        console.error(
          "Edit item loading error:",
          error.response?.data?.message || error.message
        );

        setError(
          error.response?.data?.message ||
            "Unable to load this item."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category.trim() ||
      !formData.location.trim() ||
      !formData.date
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.patch(`/items/${itemId}`, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        location: formData.location.trim(),
        date: formData.date,
        contactPreference: formData.contactPreference,
      });

      setSuccess(
        response.data.message || "Item updated successfully."
      );

      setTimeout(() => {
        navigate("/items/my-items");
      }, 900);
    } catch (error) {
      console.error(
        "Update item error:",
        error.response?.data?.message || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to update the item."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />

          <p className="mt-4 text-sm text-slate-400">
            Loading item...
          </p>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-red-400/10 bg-white/[0.03] p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="text-4xl">⚠️</div>

          <h1 className="mt-4 text-xl font-semibold">
            Unable to edit item
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {error}
          </p>

          <Link
            to="/items/my-items"
            className="mt-6 inline-block rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Back to My Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/items/my-items"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to My Items
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            CampusFind
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Edit Item ✏️
          </h1>

          <p className="mt-3 text-slate-400">
            Update the details of your reported item.
          </p>
        </motion.div>

        {/* Item Type / Status */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <span
            className={`rounded-full border px-4 py-2 text-xs font-semibold ${
              itemType === "LOST"
                ? "border-red-400/20 bg-red-400/[0.08] text-red-300"
                : "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300"
            }`}
          >
            {itemType === "LOST" ? "🔴 Lost Item" : "🟢 Found Item"}
          </span>

          <span className="rounded-full border border-indigo-400/20 bg-indigo-400/[0.08] px-4 py-2 text-xs font-semibold text-indigo-300">
            Status: {itemStatus}
          </span>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          onSubmit={handleSubmit}
          className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
        >
          {/* Error */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4 text-sm text-emerald-300">
              {success}
            </div>
          )}

          <div className="space-y-6">

            {/* Title */}
            <FormField
              label="Item Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Black Leather Wallet"
            />

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-slate-300">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the item in detail..."
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/40 focus:bg-slate-900"
              />
            </div>

            {/* Category */}
            <FormField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Example: Wallet"
            />

            {/* Location */}
            <FormField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Example: Computer Lab"
            />

            {/* Date */}
            <div>
              <label className="text-sm font-medium text-slate-300">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-sm text-white outline-none transition focus:border-indigo-400/40 focus:bg-slate-900"
              />
            </div>

            {/* Contact Preference */}
            <div>
              <label className="text-sm font-medium text-slate-300">
                Contact Preference
              </label>

              <select
                name="contactPreference"
                value={formData.contactPreference}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-sm text-white outline-none transition focus:border-indigo-400/40 focus:bg-slate-900"
              >
                <option value="CHAT">
                  Chat
                </option>

                <option value="EMAIL">
                  Email
                </option>
              </select>
            </div>

          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <Link
              to="/items/my-items"
              className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-center text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>

          </div>
        </motion.form>

        {/* Notice */}
        <p className="mt-5 text-center text-xs leading-5 text-slate-600">
          Returned or closed items cannot be edited.
        </p>

      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/40 focus:bg-slate-900"
      />
    </div>
  );
}

export default EditItem;