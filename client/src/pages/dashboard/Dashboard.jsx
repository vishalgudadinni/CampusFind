import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            CampusFind
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Welcome, {user?.name || "Student"} 👋
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Manage your lost & found activity from your CampusFind dashboard.
          </p>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
          >
            Logout
          </button>
        </motion.div>

        {/* User Information */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur-xl"
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Name */}
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Name
              </p>

              <p className="mt-2 font-medium">
                {user?.name || "—"}
              </p>
            </div>

            {/* USN */}
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                USN
              </p>

              <p className="mt-2 font-medium">
                {user?.usn || "—"}
              </p>
            </div>

            {/* Branch */}
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Branch
              </p>

              <p className="mt-2 font-medium">
                {user?.branch || "—"}
              </p>
            </div>

            {/* Campus Coins */}
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Campus Coins
              </p>

              <p className="mt-2 font-medium text-indigo-400">
                🪙 {user?.coinBalance ?? 0}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Actions */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/items/report-lost">
             <DashboardCard
               title="Report Lost"
               description="Report something you've lost on campus."
             />
           </Link>

            <Link to="/items/report-found">
             <DashboardCard
                 title="Report Found"
                 description="Help someone by reporting an item you found."
             />
           </Link>

          <Link to="/items/my-items">
          <DashboardCard
            title="My Items"
            description="View and manage your lost and found reports."
          />
          </Link>

          <Link to="/wallet">
               <DashboardCard
               title="Campus Coins"
               description="View your Campus Coin balance and rewards."
            />
          </Link>
        </div>

        {/* Back to Home */}
        <Link
          to="/"
          className="mt-10 inline-block text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

function DashboardCard({ title, description }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur-xl"
    >
      <h2 className="text-lg font-semibold">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </motion.div>
  );
}

export default Dashboard;