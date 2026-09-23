import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: "📝",
    title: "Report",
    description:
      "Tell CampusFind what you lost or found with details like the item, location, date, and description.",
  },
  {
    number: "02",
    icon: "🔎",
    title: "Match",
    description:
      "CampusFind looks for potentially matching items using descriptions, locations, dates, and other details.",
  },
  {
    number: "03",
    icon: "🛡️",
    title: "Verify",
    description:
      "The potential owner provides details that help verify their ownership before the item is handed over.",
  },
  {
    number: "04",
    icon: "🤝",
    title: "Reunite",
    description:
      "Connect securely, arrange the handover, confirm the return, and reward the finder with Campus Coins.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-slate-950 px-6 py-28"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            How it works
          </p>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            From lost to{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              reunited.
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
            A simple campus-wide process designed to make finding lost
            belongings easier and safer.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line */}
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-20 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{ y: -8 }}
              className="group relative rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/20 hover:bg-white/[0.05]"
            >
              {/* Number */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tracking-widest text-slate-600">
                  {step.number}
                </span>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-xl shadow-lg transition-transform duration-300 group-hover:scale-110">
                  {step.icon}
                </div>
              </div>

              <h3 className="mt-7 text-xl font-semibold text-white">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;