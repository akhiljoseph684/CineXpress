import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="mt-20 border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div>
          <h2 className="text-3xl font-black text-white">
            CINE<span className="text-red-600">XPRESS</span>
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-gray-400">
            Experience seamless movie booking with real-time seat selection,
            theatre discovery, trending movies, and premium entertainment.
          </p>

          <div className="mt-6 flex items-center gap-4">
            {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map(
              (Icon, index) => (
                <button
                  key={index}
                  aria-label={["Facebook", "Instagram", "Twitter", "YouTube"][index]}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-red-600 hover:bg-red-600"
                >
                  <Icon />
                </button>
              )
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Quick Links
          </h3>

          <div className="flex flex-col gap-4">
            {[
              { name: "Home", path: "/" },
              { name: "Movies", path: "/movies" },
              { name: "Theatres", path: "/theatres" },
              { name: "Profile", path: "/profile" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="text-left text-sm text-gray-400 transition hover:text-red-500"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Support
          </h3>

          <div className="flex flex-col gap-4">
            {[
              "Help Center",
              "Privacy Policy",
              "Terms & Conditions",
              "Refund Policy",
              "Contact Us",
            ].map((item) => (
              <button
                key={item}
                className="text-left text-sm text-gray-400 transition hover:text-red-500"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Contact
          </h3>

          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-red-500" />
              <p className="text-sm leading-relaxed text-gray-400">
                Kochi, Kerala, India
              </p>
            </div>

            <div className="flex items-center gap-3">
              <FaEnvelope className="text-red-500" />
              <p className="text-sm text-gray-400">
                support@cinexpress.com
              </p>
            </div>

            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-red-500" />
              <p className="text-sm text-gray-400">
                +91 95448 10427
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 md:flex-row md:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2026 CineXpress. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <button className="text-sm text-gray-500 transition hover:text-red-500">
              Privacy
            </button>

            <button className="text-sm text-gray-500 transition hover:text-red-500">
              Terms
            </button>

            <button className="text-sm text-gray-500 transition hover:text-red-500">
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;