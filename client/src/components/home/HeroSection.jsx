import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiTruck, FiShield } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden bg-hero-pattern bg-size-[400%_400%] animate-gradient-flow" id="hero-section">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent-400/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-primary-600/50 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        {/* Floating book shapes */}
        <div className="absolute top-1/4 right-1/4 w-24 h-32 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl rotate-12 animate-float" />
        <div className="absolute bottom-1/3 right-1/3 w-16 h-24 bg-accent-400/10 backdrop-blur-md border border-accent-400/20 rounded-lg -rotate-12 animate-float animate-delay-300" />
        <div className="absolute top-1/2 left-1/4 w-14 h-20 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg rotate-6 animate-float animate-delay-500" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-accent-300 text-sm font-medium mb-8 animate-fade-in shadow-xl">
              <FiBookOpen className="w-4 h-4" />
              Welcome to Aura Reads
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white font-display leading-tight mb-8 animate-slide-up">
              Discover Your{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-accent-300 to-accent-500 relative">
                Next
                <svg className="absolute -bottom-2 left-0 w-full opacity-70" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8C50 2 150 2 198 8" stroke="url(#paint0_linear)" strokeWidth="4" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="paint0_linear" x1="2" y1="5" x2="198" y2="5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#fcd34d" />
                      <stop offset="1" stopColor="#b8860b" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>{' '}
              <br />
              Great Read
            </h1>

            <p className="text-primary-100 text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto lg:mx-0 mb-10 animate-slide-up animate-delay-200 font-light leading-relaxed">
              Explore our curated collection of books across every genre. From timeless classics to the latest bestsellers — delivered right to your doorstep.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start animate-slide-up animate-delay-300">
              <Link
                to="/books"
                className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-accent-400 to-accent-500 text-white rounded-2xl font-semibold text-lg hover:from-accent-500 hover:to-accent-600 transition-all shadow-gold hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3 group"
              >
                Browse Books
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/books?filter=new-arrivals"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white rounded-2xl font-semibold text-lg hover:bg-white/10 hover:border-white/40 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl"
              >
                New Arrivals
              </Link>
            </div>

            {/* Features Strip */}
            <div className="grid grid-cols-3 gap-6 mt-16 animate-slide-up animate-delay-400">
              {[
                { icon: FiTruck, label: 'Free Delivery', sub: 'Orders ₹500+' },
                { icon: FiShield, label: 'Secure', sub: 'Cash on Delivery' },
                { icon: FiBookOpen, label: '1000+', sub: 'Books Available' },
              ].map((item, i) => (
                <div key={i} className="text-center lg:text-left">
                  <item.icon className="w-5 h-5 text-accent-400 mx-auto lg:mx-0 mb-1" />
                  <p className="text-white text-sm font-semibold">{item.label}</p>
                  <p className="text-primary-300 text-[10px]">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative w-80 h-[450px]">
              {/* Main book */}
              <div className="absolute inset-0 bg-linear-to-br from-accent-400/30 to-primary-600/30 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/10 flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="text-center p-8">
                  <div className="w-24 h-32 bg-linear-to-br from-accent-400 to-accent-600 rounded-lg mx-auto mb-6 shadow-gold flex items-center justify-center">
                    <FiBookOpen className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-white text-2xl font-display font-bold mb-2">Aura Reads</h3>
                  <p className="text-primary-200 text-sm">Your Favourite Book Store</p>
                  <div className="mt-6 flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-accent-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-primary-300 text-xs mt-2">Trusted by 1000+ readers</p>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-6 -left-12 bg-white rounded-xl p-3 shadow-xl animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary-500">COD Available</p>
                    <p className="text-[10px] text-gray-400">Pay on delivery</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-8 bg-white rounded-xl p-3 shadow-xl animate-float animate-delay-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                    <span className="text-accent-500 text-sm">📚</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary-500">All Genres</p>
                    <p className="text-[10px] text-gray-400">Fiction to Academic</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
