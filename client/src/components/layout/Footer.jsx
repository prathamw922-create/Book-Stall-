import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiClock, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-primary-500 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg font-display">B</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-display">
                  Book<span className="text-accent-300">Stall</span>
                </h3>
              </div>
            </Link>
            <p className="text-primary-200 text-sm leading-relaxed mb-6">
              Your favourite destination for books. Discover, read, and grow with our curated collection of books across all genres.
            </p>
            <div className="flex gap-3">
              {[FiFacebook, FiInstagram, FiTwitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent-400 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-accent-300 mb-4 uppercase text-xs tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/books', label: 'All Books' },
                { to: '/books?filter=new-arrivals', label: 'New Arrivals' },
                { to: '/books?filter=bestsellers', label: 'Best Sellers' },
                { to: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-primary-200 hover:text-accent-300 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-accent-300 mb-4 uppercase text-xs tracking-wider">Customer Service</h4>
            <ul className="space-y-3">
              {[
                { to: '/dashboard', label: 'My Account' },
                { to: '/orders', label: 'Track Order' },
                { to: '/cart', label: 'Shopping Cart' },
                { to: '/wishlist', label: 'Wishlist' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-primary-200 hover:text-accent-300 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-accent-300 mb-4 uppercase text-xs tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-primary-200">
                <FiMapPin className="w-4 h-4 mt-0.5 text-accent-400 shrink-0" />
                <span>123 Book Street, Reading Lane, City - 560001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-200">
                <FiPhone className="w-4 h-4 text-accent-400 shrink-0" />
                <span>+91 8180862901</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-200">
                <FiMail className="w-4 h-4 text-accent-400 shrink-0" />
                <span>prathamw922@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-200">
                <FiClock className="w-4 h-4 text-accent-400 shrink-0" />
                <span>Mon - Sat: 9AM - 9PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-300 text-sm">
            © {new Date().getFullYear()} Aura Reads. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-primary-300">
            <span className="inline-block w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
            Cash on Delivery Available
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
