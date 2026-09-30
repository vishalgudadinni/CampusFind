import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";

function MyItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const response = await api.get("/items/my-items");
        setItems(response.data.items);
      } catch (error) {
        console.error(
          "My items loading error:",
          error.response?.data?.message || error.message
        );

        setError(
          error.response?.data?.message ||
            "Unable to load your items."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyItems();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACTIVE":
        return "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300";

      case "CLAIMED":
        return "border-amber-400/20 bg-amber-400/[0.08] text-amber-300";

      case "RETURNED":
        return "border-indigo-400/20 bg-indigo-400/[0.08] text-indigo-300";

      case "CLOSED":
        return "border-slate-400/20 bg-slate-400/[0.08] text-slate-300";

      default:
        return "border-white/10 bg-white/[0.05] text-slate-300";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "ACTIVE":
        return "Active";

      case "CLAIMED":
        return "Claimed";

      case "RETURNED":
        return "Returned";

      case "CLOSED":
        return "Closed";

      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />

          <p className="mt-4 text-sm text-slate-400">
            Loading your items...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-red-400/10 bg-white/[0.03] p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="text-4xl">⚠️</div>

          <h1 className="mt-4 text-xl font-semibold">
            Unable to load items
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {error}
          </p>

          <Link
            to="/dashboard"
            className="mt-6 inline-block rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/dashboard"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            CampusFind
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            My Items
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            View and manage the lost and found items you have
            reported on CampusFind.
          </p>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 grid gap-4 sm:grid-cols-3"
        >
          <SummaryCard
            title="Total Items"
            value={items.length}
            icon="📦"
          />

          <SummaryCard
            title="Active"
            value={items.filter((item) => item.status === "ACTIVE").length}
            icon="🟢"
          />

          <SummaryCard
            title="Returned"
            value={items.filter((item) => item.status === "RETURNED").length}
            icon="🤝"
          />
        </motion.div>

        {/* Empty State */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center shadow-xl backdrop-blur-xl"
          >
            <div className="text-5xl">📦</div>

            <h2 className="mt-5 text-xl font-semibold">
              You haven't reported any items yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Report a lost or found item and it will appear here.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/items/report-lost"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Report Lost Item
              </Link>

              <Link
                to="/items/report-found"
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
              >
                Report Found Item
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">

            {items.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.15 + index * 0.08,
                }}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur-xl transition"
              >

                {/* Top Row */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        item.type === "LOST"
                          ? "border border-red-400/10 bg-red-400/[0.08]"
                          : "border border-emerald-400/10 bg-emerald-400/[0.08]"
                      }`}
                    >
                      {item.type === "LOST" ? "🔴" : "🟢"}
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {item.type === "LOST"
                          ? "Lost Item"
                          : "Found Item"}
                      </p>

                      <h2 className="mt-1 text-xl font-semibold">
                        {item.title}
                      </h2>
                    </div>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusStyle(
                      item.status
                    )}`}
                  >
                    {getStatusLabel(item.status)}
                  </span>

                </div>

                {/* Description */}
                <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>

                {/* Details */}
                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                  <InfoItem
                    label="Category"
                    value={item.category}
                  />

                  <InfoItem
                    label="Location"
                    value={item.location}
                  />

                  <InfoItem
                    label="Date"
                    value={new Date(item.date).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  />

                  <InfoItem
                    label="Reported"
                    value={new Date(
                      item.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  />

                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                  {item.status === "ACTIVE" && (
                    <Link
                      to={`/items/${item._id}/matches`}
                      className="flex-1 rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      View Matches
                    </Link>
                  )}

                  <button
                    disabled
                    className="flex-1 cursor-not-allowed rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-600"
                  >
                    Manage Item
                  </button>

                </div>

              </motion.div>
            ))}

          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-10 flex flex-wrap gap-4">

          <Link
            to="/items/report-lost"
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
          >
            + Report Lost
          </Link>

          <Link
            to="/items/report-found"
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
          >
            + Report Found
          </Link>

        </div>

      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {title}
        </p>

        <span className="text-xl">
          {icon}
        </span>
      </div>

      <p className="mt-3 text-3xl font-bold">
        {value}
      </p>
    </motion.div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-sm text-slate-300">
        {value}
      </p>
    </div>
  );
}

export default MyItems;