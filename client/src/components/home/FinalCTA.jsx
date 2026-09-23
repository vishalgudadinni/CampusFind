import { motion } from "framer-motion";

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-28">
      {/* Background effects */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/15 blur-[130px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-16 text-center shadow-2xl backdrop-blur-xl sm:px-12"
      >
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Your campus. Your community.
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Lost something?
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Let's find it.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Whether you've lost something or found something that belongs
            to someone else, CampusFind helps make the journey back home
            simpler.
          </p>

          {/* CTA buttons */}
          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl bg-white px-7 py-4 font-semibold text-slate-900 shadow-xl shadow-white/10"
            >
              I Lost Something
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
            >
              I Found Something
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default FinalCTA;