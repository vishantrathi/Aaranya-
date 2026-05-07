const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">
          <div>
            <p className="footer-brand-name">🌿 AARANYA</p>
            <p className="footer-brand-desc">
              Direct from our farm in Meerut, Uttar Pradesh — fresh mangoes, seasonal vegetables,
              grains, jaggery, and more. No middlemen. Transparent pricing.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#daily-box">Daily Box</a></li>
              <li><a href="/orders">My Orders</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <ul>
              <li><a href="#products">Mangoes</a></li>
              <li><a href="#products">Fresh Vegetables</a></li>
              <li><a href="#products">Wheat & Rice Flour</a></li>
              <li><a href="#products">Jaggery & Shakkar</a></li>
              <li><a href="#products">Sugarcane</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:+919999999999">📞 +91 99999 99999</a></li>
              <li><a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">💬 WhatsApp</a></li>
              <li><a href="mailto:info@aaranya.in">✉️ Email Us</a></li>
              <li><span style={{ color: "#a5d6a7" }}>📍 Meerut, Uttar Pradesh</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} AARANYA. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

