import { Link } from "react-router-dom";

const navItems = [
  { name: "হোম", path: "/" },
  { name: "সেবাসমূহ", path: "/services" },
  { name: "সেবাদাতা", path: "/providers" },
  { name: "কীভাবে কাজ করে", path: "/how-it-works" },
  { name: "আমাদের সম্পর্কে", path: "/about" },
];

const Navbar = () => {
  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <h1 className="font-bengali text-2xl font-bold text-primary">
            আস্থা
          </h1>

          <p className="font-bengali text-xs text-text-muted">
            আপনার প্রয়োজনের নির্ভরযোগ্য ঠিকানা
          </p>
        </Link>

        {/* Navigation */}
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

        {/* Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="font-bengali rounded-lg px-4 py-2 text-sm font-medium text-text transition-colors hover:text-primary"
          >
            লগইন
          </Link>

          <Link 
  to="/request-service" 
  className="font-bengali rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white! transition-colors hover:bg-primary-hover"
>
  সেবা চান
</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="rounded-lg p-2 text-text md:hidden"
          aria-label="মেনু খুলুন"
        >
          ☰
        </button>
      </div>
    </header>
  );
};

export default Navbar;