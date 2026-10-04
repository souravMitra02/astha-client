import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, X, Trash2 } from "lucide-react";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import useAuth from "../../hooks/useAuth";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../services/notificationService";
import socket from "../../services/socket";

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
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openLogin) {
      setShowLogin(true);

      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  }, [location, navigate]);

  useEffect(() => {
    const loadUnreadCount = async () => {
      if (!user) {
        setUnreadCount(0);
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setUnreadCount(0);
        return;
      }

      try {
        const data = await getUnreadNotificationCount(token);

        setUnreadCount(data.count || 0);
      } catch (error) {
        console.error("Unread notification count error:", error);
      }
    };

    loadUnreadCount();
  }, [user]);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) {
        setNotifications([]);
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setNotifications([]);
        return;
      }

      try {
        const data = await getMyNotifications(token);

        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("Notifications load error:", error);
      }
    };

    loadNotifications();
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [user]);

  const handleNotificationClick = async (notification) => {
    if (notification.isRead) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      await markNotificationAsRead(notification._id, token);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id
            ? { ...item, isRead: true }
            : item
        )
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Mark notification as read error:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      await markAllNotificationsAsRead(token);

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all notifications as read error:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const notification = notifications.find(
        (item) => item._id === id
      );

      await deleteNotification(id, token);

      setNotifications((prev) =>
        prev.filter((item) => item._id !== id)
      );

      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const handleLogout = () => {
    logout();
    setUnreadCount(0);
    setNotifications([]);
    setShowNotifications(false);
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
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowNotifications((prev) => !prev)
                      }
                      className="relative rounded-lg p-2.5 text-text-muted transition-colors hover:bg-background hover:text-primary"
                      aria-label="নোটিফিকেশন"
                    >
                      <Bell size={20} />

                      {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 font-bengali text-[10px] font-bold text-surface">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 top-full z-50 mt-3 w-96 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
                        <div className="flex items-center justify-between border-b border-border px-4 py-3">
                          <div>
                            <h3 className="font-heading text-base font-bold text-text">
                              নোটিফিকেশন
                            </h3>

                            {notifications.length > 0 && (
                              <p className="mt-0.5 font-bengali text-xs text-text-muted">
                                {notifications.length}টি নোটিফিকেশন
                              </p>
                            )}
                          </div>

                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={handleMarkAllAsRead}
                              className="font-bengali text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                            >
                              সব পড়া হয়েছে
                            </button>
                          )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="px-5 py-10 text-center">
                              <Bell
                                size={28}
                                className="mx-auto text-text-muted"
                              />

                              <p className="mt-3 font-bengali text-sm text-text-muted">
                                কোনো নোটিফিকেশন নেই
                              </p>
                            </div>
                          ) : (
                            notifications.map((notification) => (
                              <div
                                key={notification._id}
                                className={`flex gap-3 border-b border-border px-4 py-4 last:border-b-0 ${
                                  !notification.isRead
                                    ? "bg-primary/5"
                                    : "bg-surface"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleNotificationClick(
                                      notification
                                    )
                                  }
                                  className="flex min-w-0 flex-1 gap-3 text-left"
                                >
                                  <div className="mt-1 shrink-0">
                                    <Bell
                                      size={17}
                                      className={
                                        notification.isRead
                                          ? "text-text-muted"
                                          : "text-primary"
                                      }
                                    />
                                  </div>

                                  <div className="min-w-0">
                                    <h4 className="font-bengali text-sm font-semibold text-text">
                                      {notification.title}
                                    </h4>

                                    <p className="mt-1 font-bengali text-xs leading-5 text-text-muted">
                                      {notification.message}
                                    </p>
                                  </div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteNotification(
                                      notification._id
                                    )
                                  }
                                  className="shrink-0 self-start rounded-md p-1.5 text-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                                  aria-label="নোটিফিকেশন মুছে ফেলুন"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/dashboard"
                    className="font-bengali text-sm font-semibold text-text transition-colors hover:text-primary"
                  >
                    {user.name}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
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
              onClick={() => setShowMenu((prev) => !prev)}
              className="rounded-lg p-2 text-text transition-colors hover:bg-background hover:text-primary md:hidden"
              aria-label={
                showMenu ? "মেনু বন্ধ করুন" : "মেনু খুলুন"
              }
              aria-expanded={showMenu}
            >
              {showMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

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
                    <button
                      type="button"
                      onClick={() =>
                        setShowNotifications((prev) => !prev)
                      }
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 font-bengali text-sm font-medium text-text transition-colors hover:bg-background hover:text-primary"
                    >
                      <span className="flex items-center gap-2">
                        <Bell size={18} />
                        নোটিফিকেশন
                      </span>

                      {unreadCount > 0 && (
                        <span className="flex min-h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 font-bengali text-[10px] font-bold text-surface">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="overflow-hidden rounded-xl border border-border bg-background">
                        {unreadCount > 0 && (
                          <div className="flex justify-end border-b border-border px-4 py-2">
                            <button
                              type="button"
                              onClick={handleMarkAllAsRead}
                              className="font-bengali text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                            >
                              সব পড়া হয়েছে
                            </button>
                          </div>
                        )}

                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center">
                            <p className="font-bengali text-sm text-text-muted">
                              কোনো নোটিফিকেশন নেই
                            </p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification._id}
                              className={`flex gap-3 border-b border-border px-4 py-3 last:border-b-0 ${
                                !notification.isRead
                                  ? "bg-primary/5"
                                  : "bg-surface"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  handleNotificationClick(
                                    notification
                                  )
                                }
                                className="min-w-0 flex-1 text-left"
                              >
                                <h4 className="font-bengali text-sm font-semibold text-text">
                                  {notification.title}
                                </h4>

                                <p className="mt-1 font-bengali text-xs leading-5 text-text-muted">
                                  {notification.message}
                                </p>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteNotification(
                                    notification._id
                                  )
                                }
                                className="shrink-0 self-start rounded-md p-1.5 text-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                                aria-label="নোটিফিকেশন মুছে ফেলুন"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}

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

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onOpenRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

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