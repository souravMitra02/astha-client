import { useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "../LoginModal/LoginModal";
import useAuth from "../../hooks/useAuth";

const navItems = [
  { name: "হোম", path: "/" },
  { name: "সেবাসমূহ", path: "/services" },
  { name: "সেবাদাতা", path: "/providers" },
  { name: "কীভাবে কাজ করে", path: "/how-it-works" },
  { name: "আমাদের সম্পর্কে", path: "/about" },
];

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="shrink-0">
            <h1 className="font-bengali text-2xl font-bold text-primary">
              আস্থা
            </h1>

            <p className="font-bengali text-xs text-text-muted">
              আপনার প্রয়োজনের নির্ভরযোগ্য ঠিকানা
            </p>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="font-bengali text-sm font-medium text-text transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="font-bengali text-sm font-semibold text-text transition-colors hover:text-primary"
                >
                  {user.name}
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg px-3 py-2 font-bengali text-sm font-medium text-text-muted transition-colors hover:text-danger"
                >
                  লগআউট
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="rounded-lg px-4 py-2 font-bengali text-sm font-medium text-text transition-colors hover:text-primary"
              >
                লগইন
              </button>
            )}

            <Link
              to="/request-service"
              className="rounded-lg bg-primary px-5 py-2.5 font-bengali text-sm font-semibold text-surface transition-colors hover:bg-primary-hover"
            >
              সেবা নিন
            </Link>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-text md:hidden"
            aria-label="মেনু খুলুন"
          >
            ☰
          </button>
        </div>
      </header>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}
    </>
  );
};

export default Navbar;