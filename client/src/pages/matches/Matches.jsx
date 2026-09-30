import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../../services/api";

function Matches() {
  const { itemId } = useParams();

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/items/${itemId}/matches`);

        setItem(response.data.item);
        setMatches(response.data.matches || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to find potential matches."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [itemId]);

  const getScoreLabel = (score) => {
    if (score >= 80) {
      return "Strong potential match";
    }

    if (score >= 60) {
      return "Good potential match";
    }

    return "Possible match";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400" />

          <p className="mt-4 text-sm text-slate-400">
            Finding potential matches...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
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
          className="mt-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Match Finder
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Potential Matches
          </h1>

          {item && (
            <p className="mt-3 max-w-2xl text-slate-400">
              We compared your{" "}
              <span className="font-medium text-white">
                {item.title}
              </span>{" "}
              with active {item.type === "LOST" ? "found" : "lost"} reports
              on CampusFind.
            </p>
          )}
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Original Item */}
        {item && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur-xl"
          >
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Your report
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {item.category} · {item.location}
                </p>
              </div>

              <span className="w-fit rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-xs font-medium text-indigo-300">
                {item.type}
              </span>
            </div>
          </motion.div>
        )}

        {/* Matches */}
        <div className="mt-8">
          {matches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center"
            >
              <div className="text-5xl">🔎</div>

              <h2 className="mt-5 text-xl font-semibold">
                No potential matches yet
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
                Don't worry. Someone may report the matching item later.
                CampusFind will use the new report when searching for
                potential matches.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="mb-5">
                <h2 className="text-2xl font-bold">
                  {matches.length} Potential{" "}
                  {matches.length === 1 ? "Match" : "Matches"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  These are ranked using item details, location, date,
                  title, and description similarity.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {matches.map((match, index) => {
                  const matchedItem = match.item;

                  return (
                    <motion.div
                      key={matchedItem._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.08,
                      }}
                      className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur-xl"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500">
                            Potential match
                          </p>

                          <h3 className="mt-2 text-xl font-semibold">
                            {matchedItem.title}
                          </h3>
                        </div>

                        <div className="rounded-2xl border border-indigo-400/20 bg-indigo-400/10 px-4 py-3 text-center">
                          <p className="text-2xl font-bold text-indigo-300">
                            {match.matchScore}%
                          </p>

                          <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                            Match
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-sm font-medium text-indigo-300">
                        {getScoreLabel(match.matchScore)}
                      </p>

                      <div className="mt-6 space-y-4">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500">
                            Description
                          </p>

                          <p className="mt-1 text-sm leading-6 text-slate-300">
                            {matchedItem.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                              Category
                            </p>

                            <p className="mt-1 text-sm text-slate-300">
                              {matchedItem.category}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                              Location
                            </p>

                            <p className="mt-1 text-sm text-slate-300">
                              {matchedItem.location}
                            </p>
                          </div>
                        </div>

                        {matchedItem.reportedBy && (
                          <div className="border-t border-white/5 pt-4">
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                              Reported by
                            </p>

                            <p className="mt-1 text-sm text-slate-300">
                              {matchedItem.reportedBy.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {matchedItem.reportedBy.branch} ·{" "}
                              {matchedItem.reportedBy.usn}
                            </p>
                          </div>
                        )}
                      </div>

                      <Link to={`/claims/items/${matchedItem._id}`} className="mt-6 block w-full rounded-2xl bg-white px-5 py-3.5 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                      View & Claim
                       </Link>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Matches;