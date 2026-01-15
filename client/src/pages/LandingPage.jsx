import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
            alt="Fitness hero"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black"></div>
        </div>
        
        <div className="relative h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
            <div className="max-w-5xl">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-light tracking-tight text-white mb-8 leading-none">
                ELEVATE YOUR
                <br />
                <span className="font-semibold">TRAINING</span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl font-light tracking-wide">
                Precision tools for serious athletes. Track performance, analyze data, achieve results.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  to="/signup"
                  className="px-12 py-5 bg-white text-black rounded-none text-base font-medium tracking-widest uppercase hover:bg-zinc-200 transition-all duration-200 text-center"
                >
                  Start Now
                </Link>
                <Link
                  to="/login"
                  className="px-12 py-5 bg-transparent text-white border border-white rounded-none text-base font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-200 text-center"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-40 bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-28">
            <p className="text-zinc-500 text-sm font-medium tracking-widest uppercase mb-4">FEATURES</p>
            <h2 className="text-6xl md:text-7xl font-light tracking-tight text-white">
              Built for Performance
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
              <div className="relative h-96 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"
                  alt="Custom workouts"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <div className="text-5xl text-white mb-5">01</div>
                <h3 className="text-3xl font-light tracking-tight text-white mb-4">CUSTOM PROGRAMS</h3>
                <p className="text-base text-zinc-400 font-light tracking-wide leading-relaxed">
                  Design workouts tailored to your goals with precision tracking and measurable progress
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
              <div className="relative h-96 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
                  alt="Progress tracking"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <div className="text-5xl text-white mb-5">02</div>
                <h3 className="text-3xl font-light tracking-tight text-white mb-4">ANALYTICS</h3>
                <p className="text-base text-zinc-400 font-light tracking-wide leading-relaxed">
                  Data-driven insights to understand your performance and optimize your training
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
              <div className="relative h-96 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop"
                  alt="Nutrition tracking"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <div className="text-5xl text-white mb-5">03</div>
                <h3 className="text-3xl font-light tracking-tight text-white mb-4">NUTRITION</h3>
                <p className="text-base text-zinc-400 font-light tracking-wide leading-relaxed">
                  Monitor intake and macros with precision to fuel performance and recovery
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
              <div className="relative h-96 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=2094&auto=format&fit=crop"
                  alt="Goal setting"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <div className="text-5xl text-white mb-5">04</div>
                <h3 className="text-3xl font-light tracking-tight text-white mb-4">GOAL SETTING</h3>
                <p className="text-base text-zinc-400 font-light tracking-wide leading-relaxed">
                  Define objectives and track progress with clear milestones and actionable metrics
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-40 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="relative overflow-hidden border border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=2087&auto=format&fit=crop"
                  alt="Fitness tracking"
                  className="w-full opacity-60"
                />
              </div>
            </div>

            <div>
              <p className="text-zinc-500 text-sm font-medium tracking-widest uppercase mb-4">APPROACH</p>
              <h2 className="text-6xl md:text-7xl font-light tracking-tight text-white mb-10 leading-tight">
                Track.<br />Analyze.<br />Improve.
              </h2>
              
              <div className="space-y-8">
                <div className="border-l-2 border-white pl-6">
                  <h4 className="text-xl font-light tracking-wide text-white mb-2">MINIMAL INTERFACE</h4>
                  <p className="text-zinc-400 font-light tracking-wide">Clean design that prioritizes your data and goals</p>
                </div>
                <div className="border-l-2 border-white pl-6">
                  <h4 className="text-xl font-light tracking-wide text-white mb-2">DATA OWNERSHIP</h4>
                  <p className="text-zinc-400 font-light tracking-wide">Your information stays private and under your control</p>
                </div>
                <div className="border-l-2 border-white pl-6">
                  <h4 className="text-xl font-light tracking-wide text-white mb-2">EVIDENCE BASED</h4>
                  <p className="text-zinc-400 font-light tracking-wide">Built on proven training principles and methodology</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-black border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-6xl md:text-7xl font-light tracking-tight text-white mb-10">
            Begin Your Journey
          </h2>
          <p className="text-xl text-zinc-400 mb-16 max-w-2xl mx-auto font-light tracking-wide">
            Create an account and access professional-grade fitness tracking tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link
              to="/signup"
              className="px-16 py-6 bg-white text-black rounded-none text-base font-medium tracking-widest uppercase hover:bg-zinc-200 transition-all duration-200"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-16 py-6 bg-transparent text-white border border-white rounded-none text-base font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-200"
            >
              Sign In
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-16 text-zinc-500 text-sm tracking-widest uppercase">
            <div>Free Access</div>
            <div className="w-px h-4 bg-zinc-800"></div>
            <div>No Card Required</div>
            <div className="w-px h-4 bg-zinc-800"></div>
            <div>Start Immediately</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;