import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-20">
        <div className=" px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <Link to="/" className="text-2xl font-bold text-blue-700 flex items-center gap-2">
              <span className="inline-block align-middle">ShortSentinel</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="hover:text-blue-600 font-medium">Dashboard</Link>
              {loading ? (
                <span className="ml-2 animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full inline-block"></span>
              ) : user ? (
                <>
                  <span className="text-gray-700 font-medium">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium ml-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-blue-600 font-medium">Login</Link>
                  <Link to="/register" className="hover:text-blue-600 font-medium">Register</Link>
                </>
              )}
            </div>

            {/* Hamburger Icon */}
            <button
              className="md:hidden flex items-center text-blue-700 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md px-4 pt-2 pb-4 space-y-2 z-30">
            <Link to="/dashboard" className="block hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            {loading ? (
              <span className="block animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></span>
            ) : user ? (
              <>
                <span className="block text-gray-700 font-medium">{user.email}</span>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="block w-full text-left bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </nav>
      {/* Spacer to prevent content from being hidden under navbar */}
      <div className="h-16 md:h-16" />
    </>
  );
} 