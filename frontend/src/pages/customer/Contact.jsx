import Navbar from "../../components/layout/Navbar";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <Navbar />

      <div className="pt-28 pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="max-w-xl mb-16">
          <h1 className="text-3xl sm:text-4xl font-semibold">
            Contact Us
          </h1>
          <p className="mt-4 text-sm opacity-60">
            Have a question, feedback, or need help?  
            We’d love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-14">
 
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <Mail className="mt-1 opacity-70" size={18} />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm opacity-60">
                  support@annesiwhites.com
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <Phone className="mt-1 opacity-70" size={18} />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm opacity-60">
                  +91 98765 43210
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <MapPin className="mt-1 opacity-70" size={18} />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm opacity-60 leading-relaxed">
                  221B Fashion Street, <br />
                  New Delhi, India
                </p>
              </div>
            </div>

            <p className="text-xs opacity-50 max-w-sm">
              Our support team usually responds within 24 hours.
            </p>
          </div>
 
          <form
            onSubmit={handleSubmit}
            className="
              border border-black/10 dark:border-white/10
              rounded-3xl p-8 space-y-6
            "
          >
            <div>
              <label className="text-xs opacity-60">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="
                  mt-2 w-full bg-transparent
                  border-b border-black/20 dark:border-white/20
                  pb-2 text-sm outline-none
                  focus:border-black dark:focus:border-white
                "
              />
            </div>

            <div>
              <label className="text-xs opacity-60">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="
                  mt-2 w-full bg-transparent
                  border-b border-black/20 dark:border-white/20
                  pb-2 text-sm outline-none
                  focus:border-black dark:focus:border-white
                "
              />
            </div>

            <div>
              <label className="text-xs opacity-60">
                Message
              </label>
              <textarea
                name="message"
                rows="4"
                required
                value={form.message}
                onChange={handleChange}
                className="
                  mt-2 w-full bg-transparent
                  border-b border-black/20 dark:border-white/20
                  pb-2 text-sm outline-none resize-none
                  focus:border-black dark:focus:border-white
                "
              />
            </div>

            <button
              type="submit"
              className="
                mt-6 w-full py-3 rounded-full
                bg-black text-white
                dark:bg-white dark:text-black
                text-sm font-medium
                hover:opacity-90 transition
              "
            >
              Send Message
            </button>

            <p className="text-xs opacity-50 text-center">
              We respect your privacy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;