import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";

function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await api.get("/coins/wallet");
        setWallet(response.data.wallet);
      } catch (error) {
        console.error(
          "Wallet loading error:",
          error.response?.data?.message || error.message
        );

        setError(
          error.response?.data?.message ||
            "Unable to load your Campus Coins wallet."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-400">
            Loading your Campus Coins...
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
            Wallet unavailable
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
            Campus Coins 🪙
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Your Campus Coins are earned by successfully helping return
            lost items to their owners.
          </p>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative mt-10 overflow-hidden rounded-[2rem] border border-indigo-400/10 bg-gradient-to-br from-indigo-500/[0.12] via-white/[0.04] to-violet-500/[0.08] p-8 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-medium text-slate-400">
              Available Balance
            </p>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.08] text-3xl shadow-inner">
                🪙
              </div>

              <div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="text-5xl font-bold tracking-tight"
                >
                  {wallet?.coinBalance ?? 0}
                </motion.p>

                <p className="mt-1 text-sm text-slate-400">
                  Campus Coins
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/5 bg-black/10 p-4">
              <p className="text-sm text-slate-300">
                Hey <span className="font-semibold text-white">
                  {wallet?.name}
                </span>{" "}
                👋
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Keep helping your campus community. Successful item
                returns earn Campus Coins automatically.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your Campus Coin earning history
              </p>
            </div>
          </div>

          {wallet?.transactions?.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-xl backdrop-blur-xl">
              <div className="text-4xl">🪙</div>

              <h3 className="mt-4 text-lg font-semibold">
                No transactions yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Successfully return a found item to earn your first
                Campus Coins.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {wallet.transactions.map((transaction, index) => (
                <motion.div
                  key={transaction._id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.25 + index * 0.08,
                  }}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-xl backdrop-blur-xl transition hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.08] text-xl">
                        {transaction.type === "REWARD"
                          ? "🪙"
                          : "🎁"}
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          {transaction.reason}
                        </h3>

                        {transaction.item && (
                          <p className="mt-1 text-sm text-slate-400">
                            Item:{" "}
                            <span className="text-slate-300">
                              {transaction.item.title}
                            </span>
                          </p>
                        )}

                        {transaction.item?.category && (
                          <p className="mt-1 text-xs text-slate-500">
                            Category: {transaction.item.category}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-slate-600">
                          {new Date(
                            transaction.createdAt
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`shrink-0 text-lg font-bold ${
                        transaction.type === "REWARD"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.type === "REWARD" ? "+" : "-"}
                      {transaction.amount}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-xl backdrop-blur-xl"
        >
          <h2 className="text-lg font-semibold">
            How Campus Coins work
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <RuleCard
              icon="🤝"
              title="Return an Item"
              description="Successfully help return a found item to its owner."
            />

            <RuleCard
              icon="🪙"
              title="Earn Coins"
              description="The system automatically awards coins after both users confirm the return."
            />

            <RuleCard
              icon="🎁"
              title="Campus Rewards"
              description="Use your earned coins for eligible campus rewards when available."
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function RuleCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
      <div className="text-2xl">{icon}</div>

      <h3 className="mt-3 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default Wallet;