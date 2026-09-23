import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 px-6 pt-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center">
        <div className="grid w-full items-center gap-16 lg:grid-cols-2">

          {/* Left side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              Built for your campus community
            </div>

            {/* Heading */}
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Lost something?
              <br />

              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Let's find it.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
              CampusFind connects students with lost and found items
              across campus. Report an item, discover potential matches,
              verify ownership, and reunite with what matters.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl bg-white px-7 py-4 font-semibold text-slate-900 shadow-xl shadow-white/10"
              >
                I Lost Something
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
              >
                I Found Something
              </motion.button>
            </div>

            {/* Small trust indicators */}
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
              <span>✓ Campus verified</span>
              <span>✓ Smart matching</span>
              <span>✓ Secure communication</span>
            </div>
          </motion.div>

          {/* Right side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto h-[450px] w-full max-w-lg"
          >
            {/* Main card */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-1/2 top-1/2 w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">
                  Potential Match
                </span>

                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                  94% Match
                </span>
              </div>

              {/* Item placeholder */}
              <div className="mt-6 flex h-40 items-center justify-center rounded-2xl bg-white/5 text-6xl">
                🎧
              </div>

              <div className="mt-5">
                <h3 className="text-lg font-semibold text-white">
                  Wireless Headphones
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Found near Central Library
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs text-slate-500">
                  Today · 10:42 AM
                </span>

                <span className="text-xs font-medium text-indigo-400">
                  View match →
                </span>
              </div>
            </motion.div>

            {/* Floating card — Lost */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-0 top-16 rounded-2xl border border-white/10 bg-slate-900/90 px-5 py-4 shadow-xl backdrop-blur-xl"
            >
              <p className="text-xs text-slate-500">Lost item</p>
              <p className="mt-1 font-semibold text-white">
                Student ID Card
              </p>
              <p className="mt-1 text-xs text-indigo-400">
                Engineering Block
              </p>
            </motion.div>

            {/* Floating card — Found */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-16 right-0 rounded-2xl border border-white/10 bg-slate-900/90 px-5 py-4 shadow-xl backdrop-blur-xl"
            >
              <p className="text-xs text-slate-500">Found item</p>
              <p className="mt-1 font-semibold text-white">
                Black Backpack
              </p>
              <p className="mt-1 text-xs text-emerald-400">
                Cafeteria
              </p>
            </motion.div>

            {/* Decorative circles */}
            <div className="absolute right-16 top-5 h-3 w-3 rounded-full bg-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.8)]" />

            <div className="absolute bottom-8 left-16 h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_15px_rgba(167,139,250,0.8)]" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default Hero;