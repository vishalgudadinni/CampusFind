import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function ReturnConfirmation() {
  const { claimId } = useParams();
  const { user } = useAuth();

  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadConfirmation = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/returns/claims/${claimId}`
      );

      setConfirmation(response.data.confirmation);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load return confirmation."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (claimId) {
      loadConfirmation();
    }
  }, [claimId]);

  const handleConfirmReturn = async () => {
    try {
      setConfirming(true);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/returns/claims/${claimId}/confirm`
      );

      setConfirmation(response.data.confirmation);

      setSuccess(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to confirm the item return."
      );
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">
          Loading return confirmation...
        </p>
      </div>
    );
  }

  if (error && !confirmation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <p className="text-red-400">{error}</p>

          <Link
            to="/dashboard"
            className="mt-5 inline-block text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isFinder =
    confirmation?.finder?._id === user?._id;

  const isClaimant =
    confirmation?.claimant?._id === user?._id;

  const currentUserConfirmed = isFinder
    ? confirmation.confirmedByFinder
    : isClaimant
      ? confirmation.confirmedByClaimant
      : false;

  const otherUserConfirmed = isFinder
    ? confirmation.confirmedByClaimant
    : confirmation.confirmedByFinder;

  const isCompleted =
    confirmation?.status === "COMPLETED";

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          to={`/chat/${claimId}`}
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to Chat
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="border-b border-white/10 px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Return Confirmation
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              {confirmation?.item?.title}
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Confirm that the item has been successfully
              handed over.
            </p>
          </div>

          {/* Item Information */}
          <div className="px-6 py-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Item Details
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">
                    Category
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {confirmation?.item?.category || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Location
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {confirmation?.item?.location || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-medium text-indigo-400">
                    {confirmation?.item?.status || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmation Status */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold">
                Handover Confirmation
              </h2>

              <div className="mt-4 space-y-3">
                <StatusRow
                  label={confirmation?.finder?.name}
                  role="Finder"
                  confirmed={
                    confirmation?.confirmedByFinder
                  }
                />

                <StatusRow
                  label={confirmation?.claimant?.name}
                  role="Claimant"
                  confirmed={
                    confirmation?.confirmedByClaimant
                  }
                />
              </div>
            </div>

            {/* Completed State */}
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5"
              >
                <p className="text-lg font-bold text-emerald-400">
                  🎉 Item Successfully Returned!
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  The return has been confirmed by both
                  participants.
                </p>

                {confirmation.coinsAwarded > 0 && (
                  <p className="mt-3 text-sm font-semibold text-indigo-400">
                    🪙 +{confirmation.coinsAwarded} Campus
                    Coins awarded to the finder.
                  </p>
                )}
              </motion.div>
            )}

            {/* Waiting State */}
            {!isCompleted && currentUserConfirmed && (
              <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.05] p-5">
                <p className="font-semibold text-yellow-400">
                  ⏳ Waiting for the other participant
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Your confirmation has been recorded. The
                  return will complete once the other
                  participant confirms.
                </p>
              </div>
            )}

            {/* Other participant already confirmed */}
            {!isCompleted &&
              !currentUserConfirmed &&
              otherUserConfirmed && (
                <div className="mt-6 rounded-2xl border border-indigo-400/20 bg-indigo-400/[0.05] p-5">
                  <p className="font-semibold text-indigo-400">
                    The other participant has confirmed.
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Please confirm the return to complete
                    the handover.
                  </p>
                </div>
              )}

            {/* Error */}
            {error && (
              <p className="mt-5 text-sm text-red-400">
                {error}
              </p>
            )}

            {/* Success */}
            {success && !isCompleted && (
              <p className="mt-5 text-sm text-emerald-400">
                {success}
              </p>
            )}

            {/* Confirm Button */}
            {!isCompleted && !currentUserConfirmed && (
              <button
                type="button"
                onClick={handleConfirmReturn}
                disabled={confirming}
                className="mt-6 w-full rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {confirming
                  ? "Confirming..."
                  : "Confirm Item Returned"}
              </button>
            )}

            {/* Already Confirmed */}
            {!isCompleted && currentUserConfirmed && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center text-sm text-slate-400">
                ✓ You have already confirmed the return.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatusRow({ label, role, confirmed }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
      <div>
        <p className="text-sm font-semibold">
          {label || "User"}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {role}
        </p>
      </div>

      <div
        className={
          confirmed
            ? "text-sm font-semibold text-emerald-400"
            : "text-sm font-semibold text-yellow-400"
        }
      >
        {confirmed ? "✓ Confirmed" : "⏳ Waiting"}
      </div>
    </div>
  );
}

export default ReturnConfirmation;