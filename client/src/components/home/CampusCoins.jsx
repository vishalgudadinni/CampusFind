import { motion } from "framer-motion";

const rewards = [
  {
    icon: "☕",
    title: "Café Coupon",
    description: "Redeem coins for a campus café reward.",
  },
  {
    icon: "🎟️",
    title: "Event Pass",
    description: "Use coins toward selected campus events.",
  },
  {
    icon: "📚",
    title: "Bookstore Benefit",
    description: "Unlock selected bookstore discounts.",
  },
];

function CampusCoins() {
  return (
    <section
      id="rewards"
      className="relative overflow-hidden bg-slate-950 px-6 py-28"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Coin visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="relative flex min-h-[420px] items-center justify-center"
          >
            {/* Outer glow */}
            <div className="absolute h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

            {/* Coin */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotateY: [0, 8, 0, -8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative flex h-56 w-56 items-center justify-center rounded-full border border-amber-300/30 bg-gradient-to-br from-amber-200/20 via-amber-400/10 to-amber-600/20 shadow-[0_0_80px_rgba(245,158,11,0.15)]"
            >
              <div className="flex h-44 w-44 items-center justify-center rounded-full border border-amber-300/20 bg-slate-900/80 shadow-inner">
                <span className="text-7xl font-bold text-amber-300">
                  C
                </span>
              </div>

              {/* Coin label */}
              <div className="absolute -bottom-5 rounded-full border border-white/10 bg-slate-900 px-5 py-2 shadow-xl">
                <span className="text-sm font-semibold text-amber-300">
                  Campus Coin
                </span>
              </div>
            </motion.div>

            {/* Floating balance card */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute right-[8%] top-[12%] rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl"
            >
              <p className="text-xs text-slate-500">Your balance</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xl">🪙</span>
                <span className="text-xl font-bold text-white">120</span>
              </div>
            </motion.div>

            {/* Floating reward card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-[12%] left-[5%] rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl"
            >
              <p className="text-xs text-slate-500">Recent reward</p>
              <p className="mt-1 font-semibold text-amber-300">
                +25 Coins
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Successful return
              </p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
              Campus Coins
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Good deeds deserve{" "}
              <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                recognition.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              When you successfully return a lost item, CampusFind rewards
              you with Campus Coins. Use them to unlock sample campus
              rewards and recognition.
            </p>

            {/* Rule */}
            <div className="mt-8 rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-5">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
                  🪙
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Earn through successful returns
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Coins are awarded by CampusFind after a successful
                    return is confirmed. They cannot be transferred
                    between users or converted into cash.
                  </p>
                </div>
              </div>
            </div>

            {/* Rewards */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {rewards.map((reward) => (
                <motion.div
                  key={reward.title}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.05]"
                >
                  <span className="text-2xl">{reward.icon}</span>

                  <h4 className="mt-3 text-sm font-semibold text-white">
                    {reward.title}
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {reward.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default CampusCoins;