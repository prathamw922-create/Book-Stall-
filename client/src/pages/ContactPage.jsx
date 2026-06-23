import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call for contact form
    setTimeout(() => {
      setLoading(false);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 page-enter page-enter-active">
      {/* Header */}
      <div className="text-center mb-16 animate-slide-up">
        <h1 className="text-4xl lg:text-5xl font-bold font-display text-primary-500 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Have a question about a book, an order, or just want to say hi? We'd love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Contact Information & Map */}
        <div className="space-y-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="bg-white rounded-3xl shadow-sm border border-surface-200 p-8 lg:p-10">
            <h2 className="text-2xl font-bold font-display text-primary-500 mb-8">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center shrink-0">
                  <FiMapPin className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-500 mb-1">Our Store Location</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    123 Book Street, Reading Lane<br />
                    City, State - 560001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center shrink-0">
                  <FiPhone className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-500 mb-1">Phone Number</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    <a href="https://wa.me/918180862901?text=Hello%20I%20have%20an%20inquiry%20about%20a%20book" target="_blank" rel="noopener noreferrer" className="hover:text-primary-500 transition-colors">
                      +91 8180862901
                    </a><br />
                    <span className="text-gray-400 text-xs">Available for WhatsApp and Calls</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center shrink-0">
                  <FiMail className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-500 mb-1">Email Address</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    prathamw922@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center shrink-0">
                  <FiClock className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-500 mb-1">Working Hours</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Monday - Saturday: 9:00 AM - 9:00 PM<br />
                    Sunday: 10:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl shadow-lg border border-surface-200 p-8 lg:p-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-2xl font-bold font-display text-primary-500 mb-2">Send us a Message</h2>
          <p className="text-gray-500 text-sm mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="input-field"
                placeholder="How can we help you?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea
                name="message"
                required
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="input-field resize-none"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-accent py-4 flex justify-center items-center gap-2 group"
            >
              {loading ? (
                'Sending Message...'
              ) : (
                <>
                  Send Message
                  <FiSend className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
