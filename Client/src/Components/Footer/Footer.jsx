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

import {
  useNavigate,
} from "react-router-dom";

function Footer() {

  const navigate =
    useNavigate();

  return (
    <footer
      className="
        bg-[#0b0b0b]
        border-t
        border-white/10
        mt-20
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto

          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4

          gap-10

          px-4
          md:px-8

          py-14
        "
      >

        <div>

          <h2
            className="
              text-3xl
              font-black
              text-white
            "
          >

            CINE
            <span className="text-pink-500">
              XPRESS
            </span>

          </h2>

          <p
            className="
              text-gray-400
              mt-5
              leading-relaxed
              text-sm
            "
          >

            Experience seamless movie booking
            with real-time seat selection,
            theatre discovery, trending movies,
            and premium entertainment.

          </p>

          <div
            className="
              flex items-center
              gap-4
              mt-6
            "
          >

            {
              [
                FaFacebookF,
                FaInstagram,
                FaTwitter,
                FaYoutube,
              ].map((Icon, index) => (

                <button
                  key={index}
                  className="
                    w-10 h-10
                    rounded-full

                    bg-white/5

                    hover:bg-pink-500

                    transition

                    flex items-center
                    justify-center

                    text-white
                  "
                >

                  <Icon />

                </button>
              ))
            }

          </div>

        </div>

        <div>

          <h3
            className="
              text-white
              font-semibold
              text-lg
              mb-5
            "
          >

            Quick Links

          </h3>

          <div
            className="
              flex flex-col
              gap-4
            "
          >

            {
              [
                {
                  name: "Home",
                  path: "/",
                },

                {
                  name: "Movies",
                  path: "/movies",
                },

                {
                  name: "Theatres",
                  path: "/theatres",
                },

                {
                  name: "Profile",
                  path: "/profile",
                },

              ].map((item) => (

                <button
                  key={item.name}
                  onClick={() =>
                    navigate(item.path)
                  }
                  className="
                    text-left
                    text-gray-400

                    hover:text-pink-500

                    transition

                    text-sm
                  "
                >

                  {item.name}

                </button>
              ))
            }

          </div>

        </div>

        <div>

          <h3
            className="
              text-white
              font-semibold
              text-lg
              mb-5
            "
          >

            Support

          </h3>

          <div
            className="
              flex flex-col
              gap-4
            "
          >

            {
              [
                "Help Center",
                "Privacy Policy",
                "Terms & Conditions",
                "Refund Policy",
                "Contact Us",
              ].map((item) => (

                <button
                  key={item}
                  className="
                    text-left
                    text-gray-400

                    hover:text-pink-500

                    transition

                    text-sm
                  "
                >

                  {item}

                </button>
              ))
            }

          </div>

        </div>

        <div>

          <h3
            className="
              text-white
              font-semibold
              text-lg
              mb-5
            "
          >

            Contact

          </h3>

          <div
            className="
              flex flex-col
              gap-5
            "
          >

            <div
              className="
                flex items-start
                gap-3
              "
            >

              <FaMapMarkerAlt
                className="
                  text-pink-500
                  mt-1
                "
              />

              <p
                className="
                  text-gray-400
                  text-sm
                  leading-relaxed
                "
              >

                Kochi, Kerala, India

              </p>

            </div>

            <div
              className="
                flex items-center
                gap-3
              "
            >

              <FaEnvelope
                className="
                  text-pink-500
                "
              />

              <p
                className="
                  text-gray-400
                  text-sm
                "
              >

                support@cinexpress.com

              </p>

            </div>

            <div
              className="
                flex items-center
                gap-3
              "
            >

              <FaPhoneAlt
                className="
                  text-pink-500
                "
              />

              <p
                className="
                  text-gray-400
                  text-sm
                "
              >

                +91 95448 10427

              </p>

            </div>

          </div>

        </div>

      </div>

      <div
        className="
          border-t
          border-white/10
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto

            flex flex-col
            md:flex-row

            items-center
            justify-between

            gap-3

            px-4
            md:px-8

            py-5
          "
        >

          <p
            className="
              text-gray-500
              text-sm
              text-center
            "
          >

            © 2026 CineXpress.
            All rights reserved.

          </p>

          <div
            className="
              flex items-center
              gap-5
            "
          >

            <button
              className="
                text-gray-500
                hover:text-pink-500
                transition
                text-sm
              "
            >

              Privacy

            </button>

            <button
              className="
                text-gray-500
                hover:text-pink-500
                transition
                text-sm
              "
            >

              Terms

            </button>

            <button
              className="
                text-gray-500
                hover:text-pink-500
                transition
                text-sm
              "
            >

              Cookies

            </button>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;