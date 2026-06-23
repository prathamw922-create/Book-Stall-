const WHATSAPP_NUMBER = '918180862901'; // Replace with actual number

export const openWhatsApp = (message = '') => {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(url, '_blank');
};

export const generateOrderWhatsAppMessage = (order) => {
  const itemsList = order.items
    .map((item) => `• ${item.title} (x${item.quantity}) - ₹${item.price * item.quantity}`)
    .join('\n');

  return `Hello, I have placed an order.

Order Number: ${order.orderNumber}

Name: ${order.shippingAddress.fullName}
Phone: ${order.shippingAddress.phone}
Address: ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}

Items:
${itemsList}

Subtotal: ₹${order.subtotal}
Delivery: ₹${order.deliveryCharge}
Grand Total: ₹${order.grandTotal}

Payment: Cash on Delivery

Please confirm my order. Thank you!`;
};
