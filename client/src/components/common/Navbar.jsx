import { motion } from "framer-motion";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-4 shadow-2xl backdrop-blur-xl">
        
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex cursor-pointer items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-xl shadow-lg shadow-indigo-500/30">
            🔎
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">
              CampusFind
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">
              Lost & Found
            </p>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#how-it-works"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            How it works
          </a>

          <a
            href="#rewards"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Campus Coins
          </a>

          <a
            href="#about"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            About
          </a>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <button className="hidden rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white sm:block">
            Login
          </button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;