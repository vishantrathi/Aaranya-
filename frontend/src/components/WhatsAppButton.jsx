const WhatsAppButton = () => {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER || "919999999999";
  const text = encodeURIComponent("Hello, I want to place an order with AARANYA.");

  return (
    <a
      className="whatsapp-btn"
      href={`https://wa.me/${phone}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Order on WhatsApp"
    >
      <span className="whatsapp-btn-full">WhatsApp Order</span>
      <span className="whatsapp-btn-short">WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
