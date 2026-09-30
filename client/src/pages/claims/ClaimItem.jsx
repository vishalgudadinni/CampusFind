import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../../services/api";

function ClaimItem() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [verificationMessage, setVerificationMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!verificationMessage.trim()) {
      setError(
        "Please provide some details that help prove the item belongs to you."
      );
      return;
    }

    if (verificationMessage.trim().length < 15) {
      setError(
        "Please provide a little more detail for ownership verification."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(`/claims/items/${itemId}`, {
        verificationMessage: verificationMessage.trim(),
      });

      setSuccess(
        response.data.message || "Claim request submitted successfully."
      );

      setVerificationMessage("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1800);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong while submitting your claim.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/dashboard"
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Ownership Verification
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Claim this item
          </h1>

          <p className="mt-3 leading-7 text-slate-400">
            Tell the finder something about the item that only the genuine
            owner would reasonably know.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          <div className="rounded-2xl border border-indigo-400/10 bg-indigo-400/[0.03] p-5">
            <p className="text-sm font-semibold text-indigo-300">
              What should you include?
            </p>

            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
              <li>• A unique mark, scratch, sticker, or colour detail</li>
              <li>• What was inside the item</li>
              <li>• A distinguishing feature not mentioned in the listing</li>
              <li>• Where you believe you lost it</li>
            </ul>
          </div>

          <div className="mt-6">
            <label
              htmlFor="verificationMessage"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Ownership details
            </label>

            <textarea
              id="verificationMessage"
              value={verificationMessage}
              onChange={(event) => {
                setVerificationMessage(event.target.value);
                setError("");
                setSuccess("");
              }}
              rows="7"
              placeholder="Example: The wallet has a small scratch near the zipper. It contains my college ID and a blue SBI card. I believe I lost it near the computer lab after my afternoon class."
              className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
            />

            <p className="mt-2 text-xs text-slate-500">
              Don't share passwords, OTPs, banking details, or other
              sensitive information here.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-300"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm leading-6 text-emerald-300"
            >
              {success}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-white px-6 py-4 font-semibold text-slate-900 shadow-xl shadow-white/10 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting claim..." : "Submit Claim Request"}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}

export default ClaimItem;