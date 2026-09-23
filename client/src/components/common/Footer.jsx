function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-6">
      <div className="mx-auto max-w-7xl py-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-xl shadow-lg shadow-indigo-500/20">
                🔎
              </div>

              <div>
                <h3 className="font-bold text-white">
                  CampusFind
                </h3>

                <p className="text-[10px] uppercase tracking-widest text-slate-500">
                  Lost & Found
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              A campus-focused platform designed to help students
              discover, verify, and reunite lost belongings.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <h4 className="text-sm font-semibold text-white">
                Platform
              </h4>

              <div className="mt-4 space-y-3">
                <a
                  href="#how-it-works"
                  className="block text-sm text-slate-500 transition hover:text-white"
                >
                  How it works
                </a>

                <a
                  href="#rewards"
                  className="block text-sm text-slate-500 transition hover:text-white"
                >
                  Campus Coins
                </a>

                <a
                  href="#about"
                  className="block text-sm text-slate-500 transition hover:text-white"
                >
                  Features
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white">
                Account
              </h4>

              <div className="mt-4 space-y-3">
                <button className="block text-sm text-slate-500 transition hover:text-white">
                  Login
                </button>

                <button className="block text-sm text-slate-500 transition hover:text-white">
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-600 sm:flex-row">
          <p>© 2026 CampusFind. Built for campus communities.</p>

          <p>Lost something? Found something? Let's reunite it.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;