import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
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
  const [showRegister, setShowRegister] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { user, logout } = useAuth();

  const closeMenu = () => {
    setShowMenu(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              to="/"
              className="shrink-0"
              onClick={closeMenu}
            >
              <h1 className="font-bengali text-2xl font-bold text-primary">
                আস্থা
              </h1>

              <p className="font-bengali text-xs text-text-muted">
                আপনার প্রয়োজনের নির্ভরযোগ্য ঠিকানা
              </p>
            </Link>

            {/* Desktop Navigation */}
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

            {/* Desktop Actions */}
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

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="rounded-lg p-2 text-text transition-colors hover:bg-background hover:text-primary md:hidden"
              aria-label={showMenu ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
              aria-expanded={showMenu}
            >
              {showMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMenu && (
            <div className="border-t border-border py-4 md:hidden">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-2.5 font-bengali text-sm font-medium text-text transition-colors hover:bg-background hover:text-primary"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-4 border-t border-border pt-4">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/dashboard"
                      onClick={closeMenu}
                      className="rounded-lg px-3 py-2.5 font-bengali text-sm font-semibold text-text transition-colors hover:bg-background hover:text-primary"
                    >
                      {user.name}
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-lg px-3 py-2.5 text-left font-bengali text-sm font-medium text-text-muted transition-colors hover:bg-background hover:text-danger"
                    >
                      লগআউট
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      setShowLogin(true);
                    }}
                    className="w-full rounded-lg px-3 py-2.5 text-left font-bengali text-sm font-medium text-text transition-colors hover:bg-background hover:text-primary"
                  >
                    লগইন
                  </button>
                )}

                <Link
                  to="/request-service"
                  onClick={closeMenu}
                  className="mt-3 block rounded-lg bg-primary px-5 py-2.5 text-center font-bengali text-sm font-semibold text-surface transition-colors hover:bg-primary-hover"
                >
                  সেবা নিন
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onOpenRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {/* Register Modal */}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onOpenLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
