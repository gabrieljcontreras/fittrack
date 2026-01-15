import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-black border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-light tracking-widest text-white uppercase hover:text-zinc-400 transition-colors">
            FITTRACK
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`font-light tracking-wide uppercase text-sm transition-colors ${
                    isActive('/dashboard') ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/log-workout" 
                  className={`font-light tracking-wide uppercase text-sm transition-colors ${
                    isActive('/log-workout') ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Log Workout
                </Link>
                <Link 
                  to="/workout-history" 
                  className={`font-light tracking-wide uppercase text-sm transition-colors ${
                    isActive('/workout-history') ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  History
                </Link>
                <Link 
                  to="/analytics" 
                  className={`font-light tracking-wide uppercase text-sm transition-colors ${
                    isActive('/analytics') ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Analytics
                </Link>
                <Link 
                  to="/ai-coach" 
                  className={`font-light tracking-wide uppercase text-sm transition-colors ${
                    isActive('/ai-coach') ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  AI Coach
                </Link>
                <Link 
                  to="/goals" 
                  className={`font-light tracking-wide uppercase text-sm transition-colors ${
                    isActive('/goals') ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Goals
                </Link>
                <button
                  onClick={logoutUser}
                  className="px-6 py-3 bg-transparent text-white border border-zinc-700 hover:bg-white hover:text-black transition-all duration-200 font-medium tracking-widest uppercase text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-zinc-400 hover:text-white font-light tracking-wide uppercase text-sm transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-white text-black hover:bg-zinc-200 transition-all duration-200 font-medium tracking-widest uppercase text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;