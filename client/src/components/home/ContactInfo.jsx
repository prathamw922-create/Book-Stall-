import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { openWhatsApp } from '../../utils/whatsapp';

const ContactInfo = () => {
  return (
    <section className="py-16 lg:py-24 bg-surface-50" id="contact-info">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl mx-auto">
          <div>
            {/* Contact Details */}
            <div className="p-8 lg:p-12 xl:p-16 bg-primary-500 text-white">
              <p className="text-accent-400 font-semibold text-sm uppercase tracking-wider mb-2">Get in Touch</p>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-8">Visit Our Store</h2>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <FiMapPin className="w-6 h-6 text-accent-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Location</h4>
                    <p className="text-primary-200">123 Book Street, Reading Lane<br />City, State - 560001</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <FiPhone className="w-6 h-6 text-accent-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Phone</h4>
                    <p className="text-primary-200">
                      <a href="https://wa.me/918180862901?text=Hello%20I%20have%20an%20inquiry%20about%20a%20book" target="_blank" rel="noopener noreferrer" className="hover:text-accent-300 transition-colors">
                        +91 8180862901
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <FiMail className="w-6 h-6 text-accent-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Email</h4>
                    <p className="text-primary-200">prathamw922@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <FiClock className="w-6 h-6 text-accent-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Working Hours</h4>
                    <p className="text-primary-200">Monday - Saturday<br />9:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 text-center">
                <button
                  onClick={() => openWhatsApp('Hi! I need help with an order.')}
                  className="w-full sm:w-auto px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors inline-flex items-center justify-center gap-3"
                >
                  <FaWhatsapp className="w-6 h-6" />
                  Chat on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
