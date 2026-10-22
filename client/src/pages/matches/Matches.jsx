
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import api from "../../services/api";

const REPORT_REASONS = [
  { value: "FAKE_LISTING", label: "Fake listing" },
  { value: "MISINFORMATION", label: "Misleading information" },
  { value: "SCAM", label: "Scam or suspicious activity" },
  { value: "DUPLICATE", label: "Duplicate listing" },
  { value: "INAPPROPRIATE", label: "Inappropriate content" },
  { value: "OTHER", label: "Other" },
];

function Matches() {
  const { itemId } = useParams();

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reportItem, setReportItem] = useState(null);
  const [reportReason, setReportReason] = useState("FAKE_LISTING");
  const [reportDescription, setReportDescription] = useState("");
  const [reportError, setReportError] = useState("");
  const [reportSuccess, setReportSuccess] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

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
    if (score >= 80) return "Strong potential match";
    if (score >= 60) return "Good potential match";
    return "Possible match";
  };

  const openReportModal = (matchedItem) => {
    setReportItem(matchedItem);
    setReportReason("FAKE_LISTING");
    setReportDescription("");
    setReportError("");
    setReportSuccess("");
  };

  const closeReportModal = () => {
    if (reportLoading) return;

    setReportItem(null);
    setReportError("");
    setReportSuccess("");
  };

  const handleReportSubmit = async (event) => {
    event.preventDefault();
    setReportError("");
    setReportSuccess("");

    if (!reportDescription.trim()) {
      setReportError("Please explain why you are reporting this listing.");
      return;
    }

    setReportLoading(true);

    try {
      const response = await api.post(
        `/reports/items/${reportItem._id}`,
        {
          reason: reportReason,
          description: reportDescription.trim(),
        }
      );

      setReportSuccess(
        response.data.message || "Report submitted successfully."
      );
    } catch (error) {
      setReportError(
        error.response?.data?.message ||
          "Unable to submit your report. Please try again."
      );
    } finally {
      setReportLoading(false);
    }
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
        <Link
          to="/dashboard"
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Match Finder
          </p>

          <h1 className="mt-3 text-4xl font-bold">Potential Matches</h1>

          {item && (
            <p className="mt-3 max-w-2xl text-slate-400">
              We compared your{" "}
              <span className="font-medium text-white">{item.title}</span>{" "}
              with active {item.type === "LOST" ? "found" : "lost"} reports
              on CampusFind.
            </p>
          )}
        </motion.div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

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
                <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
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
                  These are ranked using item details, location, date, title,
                  and description similarity.
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

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <Link
                          to={`/claims/items/${matchedItem._id}`}
                          className="block w-full rounded-2xl bg-white px-5 py-3.5 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                        >
                          View & Claim
                        </Link>

                        <button
                          type="button"
                          onClick={() => openReportModal(matchedItem)}
                          className="w-full rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-3.5 text-sm font-semibold text-red-300 transition hover:border-red-400/40 hover:bg-red-400/10"
                        >
                          ⚑ Report Listing
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {reportItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeReportModal}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="report-title"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={(event) => event.stopPropagation()}
              className="my-8 w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                    CampusFind Safety
                  </p>
                  <h2 id="report-title" className="mt-2 text-2xl font-bold">
                    Report listing
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Reporting:{" "}
                    <span className="font-medium text-white">
                      {reportItem.title}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeReportModal}
                  disabled={reportLoading}
                  aria-label="Close report form"
                  className="rounded-xl border border-white/10 px-3 py-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  ✕
                </button>
              </div>

              {reportSuccess ? (
                <div className="mt-6">
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm leading-6 text-emerald-300">
                    {reportSuccess}
                  </div>
                  <button
                    type="button"
                    onClick={closeReportModal}
                    className="mt-5 w-full rounded-2xl bg-white px-5 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="mt-6">
                  <label
                    htmlFor="reportReason"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Reason for reporting
                  </label>

                  <select
                    id="reportReason"
                    value={reportReason}
                    onChange={(event) => setReportReason(event.target.value)}
                    disabled={reportLoading}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-red-400/50"
                  >
                    {REPORT_REASONS.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>

                  <label
                    htmlFor="reportDescription"
                    className="mb-2 mt-5 block text-sm font-medium text-slate-300"
                  >
                    Explain the issue
                  </label>

                  <textarea
                    id="reportDescription"
                    value={reportDescription}
                    onChange={(event) => {
                      setReportDescription(event.target.value);
                      setReportError("");
                    }}
                    disabled={reportLoading}
                    rows={5}
                    maxLength={1000}
                    required
                    placeholder="Explain what seems suspicious or incorrect..."
                    className="w-full resize-y rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-red-400/50"
                  />

                  <p className="mt-2 text-right text-xs text-slate-500">
                    {reportDescription.length}/1000 characters
                  </p>

                  {reportError && (
                    <div
                      role="alert"
                      className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-300"
                    >
                      {reportError}
                    </div>
                  )}

                  <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={closeReportModal}
                      disabled={reportLoading}
                      className="flex-1 rounded-2xl border border-white/10 px-5 py-3.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={
                        reportLoading ||
                        !reportDescription.trim() ||
                        reportDescription.trim().length > 1000
                      }
                      className="flex-1 rounded-2xl bg-red-400 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {reportLoading ? "Submitting..." : "Submit Report"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Matches;
