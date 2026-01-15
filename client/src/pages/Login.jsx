import { useState, useContext } from "react";
import { login } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const data = await login(email, password);
      loginUser(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-zinc-900 border border-zinc-800 p-12">
        <div className="mb-10">
          <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-4">WELCOME BACK</p>
          <h2 className="text-4xl font-light tracking-tight text-white">Sign In</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-light tracking-wide text-zinc-400 mb-3 uppercase text-xs">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-light tracking-wide"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-light tracking-wide text-zinc-400 mb-3 uppercase text-xs">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-light tracking-wide"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-950 border border-red-900">
              <p className="text-sm text-red-200 font-light tracking-wide">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-white text-black font-medium tracking-widest uppercase text-sm hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-zinc-800">
          <p className="text-center text-zinc-500 font-light tracking-wide text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-white hover:text-zinc-300 font-medium uppercase text-xs tracking-widest">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;