import { motion } from "framer-motion";

const features = [
  {
    icon: "🔎",
    title: "Smart Matching",
    description:
      "Find potential matches using item descriptions, campus locations, dates, and other relevant details.",
  },
  {
    icon: "🛡️",
    title: "Ownership Verification",
    description:
      "Help ensure items are returned to their rightful owners before a handover is completed.",
  },
  {
    icon: "💬",
    title: "Secure Communication",
    description:
      "Connect with potential matches through CampusFind without unnecessarily exposing personal contact details.",
  },
  {
    icon: "🚩",
    title: "Community Reporting",
    description:
      "Report suspicious, misleading, duplicate, or inappropriate listings to help keep the campus community trustworthy.",
  },
];

function Features() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-slate-950 px-6 py-28"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute left-0 top-1/3 h-96 w-96 rounded-full bg-indigo-600/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Why CampusFind
          </p>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            More than a{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              lost & found board.
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
            CampusFind brings discovery, verification, communication, and
            recognition together in one campus-focused platform.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -8,
              }}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/20 hover:bg-white/[0.05]"
            >
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="mt-7 text-xl font-semibold text-white">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {feature.description}
              </p>

              {/* Bottom accent */}
              <div className="mt-7 h-px w-10 bg-indigo-400/40 transition-all duration-300 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;