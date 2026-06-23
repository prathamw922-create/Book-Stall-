import { FaWhatsapp } from 'react-icons/fa';
import { openWhatsApp } from '../../utils/whatsapp';

const WhatsAppButton = () => {
  return (
    <button
      onClick={() => openWhatsApp('Hi! I would like to know more about your books.')}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95"
      title="Chat on WhatsApp"
      id="whatsapp-button"
    >
      <FaWhatsapp className="w-7 h-7" />
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat with us
        <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
      </span>
    </button>
  );
};

export default WhatsAppButton;
