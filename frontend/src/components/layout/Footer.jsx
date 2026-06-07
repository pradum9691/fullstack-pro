import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="
        bg-white text-black
        dark:bg-black dark:text-white
        transition-colors
      "
    >
    
      <div className="border-t border-black/10 dark:border-white/10" />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
 
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20">

  
          <div>
            <h3 className="text-sm tracking-[0.35em] uppercase font-semibold mb-8">
              Annesie Whites
            </h3>
            <p className="text-sm leading-relaxed opacity-70 dark:opacity-80 max-w-xs">
              Timeless essentials crafted with precision,
              comfort, and purpose — designed for modern living.
            </p>
          </div>
 
          <div>
            <h4 className="text-sm font-medium mb-8">Shop</h4>
            <ul className="space-y-5 text-sm">
              {["All Products", "New Arrivals", "Best Sellers"].map((item) => (
                <li key={item}>
                  <Link
                    to="/products"
                    className="opacity-70 dark:opacity-80 hover:opacity-100 transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
 
          <div>
            <h4 className="text-sm font-medium mb-8">Company</h4>
            <ul className="space-y-5 text-sm">
              {["About", "Contact", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="opacity-70 dark:opacity-80 hover:opacity-100 transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

    
          <div>
            <h4 className="text-sm font-medium mb-8">
              Stay Connected
            </h4>
            <p className="text-sm opacity-70 dark:opacity-80 mb-8">
              Get updates on new drops and exclusive offers.
            </p>

            <form
              className="
                flex items-center gap-3
                border-b border-black/30 dark:border-white/30
                focus-within:border-black dark:focus-within:border-white
                transition-colors
              "
            >
              <input
                type="email"
                placeholder="Email address"
                className="
                  w-full bg-transparent py-3
                  text-sm outline-none
                  placeholder:opacity-50
                "
              />
              <button
                type="submit"
                className="
                  text-sm tracking-widest
                  opacity-60 hover:opacity-100
                  transition
                "
              >
                →
              </button>
            </form>
          </div>

        </div>
 
        <div
          className="
            mt-32 pt-10
            border-t border-black/10 dark:border-white/10
            flex flex-col md:flex-row
            justify-between items-center
            gap-6 text-xs
            opacity-60
          "
        >
          <span>© 2026 Annesie Whites. All rights reserved.</span>

          <div className="flex gap-8 tracking-wide">
            {["Instagram", "Twitter", "LinkedIn"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:opacity-100 transition"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
