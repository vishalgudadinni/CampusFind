import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../../services/api";

function ClaimRequests() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/claims/received");

      setClaims(response.data.claims || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load claim requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleAction = async (claimId, action) => {
    try {
      setActionLoading(claimId);

      await api.patch(`/claims/${claimId}/${action}`);

      await fetchClaims();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          `Unable to ${action} this claim.`
      );
    } finally {
      setActionLoading("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">
          Loading claim requests...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
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
            Claim Requests
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            People claiming your found items
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Review the ownership information before deciding whether
            to accept a claim.
          </p>
        </motion.div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {claims.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <div className="text-5xl">📭</div>

            <h2 className="mt-5 text-xl font-semibold">
              No claim requests yet
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              When someone claims one of your found items,
              their request will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-5">
            {claims.map((claim) => (
              <motion.div
                key={claim._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur-xl"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Item
                    </p>

                    <h2 className="mt-2 text-xl font-semibold">
                      {claim.item?.title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      {claim.item?.category} ·{" "}
                      {claim.item?.location}
                    </p>
                  </div>

                  <span
                    className={`h-fit rounded-full px-4 py-2 text-xs font-medium ${
                      claim.status === "PENDING"
                        ? "bg-amber-400/10 text-amber-300"
                        : claim.status === "ACCEPTED"
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-red-400/10 text-red-300"
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>

                <div className="mt-6 border-t border-white/5 pt-6">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Claimant
                  </p>

                  <p className="mt-2 font-medium">
                    {claim.claimant?.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {claim.claimant?.branch} ·{" "}
                    {claim.claimant?.usn}
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-indigo-400/10 bg-indigo-400/[0.03] p-5">
                  <p className="text-xs uppercase tracking-wider text-indigo-400">
                    Ownership verification
                  </p>

                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {claim.verificationMessage}
                  </p>
                </div>

                {claim.status === "PENDING" && (
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      disabled={actionLoading === claim._id}
                      onClick={() =>
                        handleAction(claim._id, "accept")
                      }
                      className="flex-1 rounded-2xl bg-emerald-400 px-5 py-3.5 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50"
                    >
                      {actionLoading === claim._id
                        ? "Processing..."
                        : "Accept Claim"}
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading === claim._id}
                      onClick={() =>
                        handleAction(claim._id, "reject")
                      }
                      className="flex-1 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-3.5 font-semibold text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
                    >
                      Reject Claim
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClaimRequests;