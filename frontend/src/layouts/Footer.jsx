"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const Footer = () => {
  const footerLinks = {
    about: [
      { label: "Contact Us", link: "/contact" },
      { label: "About Us", link: "/about" },
      { label: "Careers", link: "/careers" },
      { label: "BuyKart Stories", link: "#" },
      { label: "Press", link: "#" },
    ],
    help: [
      { label: "Payments", link: "/payments" },
      { label: "Shipping", link: "/shipping" },
      { label: "Cancellation & Returns", link: "/returns" },
      { label: "FAQ", link: "/faq" },
      { label: "Report Infringement", link: "#" },
    ],
    policy: [
      { label: "Return Policy", link: "/return-policy" },
      { label: "Terms Of Use", link: "/terms" },
      { label: "Security", link: "#" },
      { label: "Privacy", link: "/privacy" },
      { label: "Sitemap", link: "#" },
    ],
    social: [
      { label: "Facebook", link: "#" },
      { label: "Twitter", link: "#" },
      { label: "YouTube", link: "#" },
    ],
  }

  return (
    <footer className="bg-[#172337] text-white mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8">
          {/* About */}
          <div>
            <h4 className="text-gray-400 text-xs font-medium mb-3 uppercase tracking-wider">About</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((item) => (
                <li key={item.label}>
                  <Link to={item.link} className="text-sm text-white hover:underline transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-gray-400 text-xs font-medium mb-3 uppercase tracking-wider">Help</h4>
            <ul className="space-y-2">
              {footerLinks.help.map((item) => (
                <li key={item.label}>
                  <Link to={item.link} className="text-sm text-white hover:underline transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h4 className="text-gray-400 text-xs font-medium mb-3 uppercase tracking-wider">Policy</h4>
            <ul className="space-y-2">
              {footerLinks.policy.map((item) => (
                <li key={item.label}>
                  <Link to={item.link} className="text-sm text-white hover:underline transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-gray-400 text-xs font-medium mb-3 uppercase tracking-wider">Social</h4>
            <ul className="space-y-2">
              {footerLinks.social.map((item) => (
                <li key={item.label}>
                  <a href={item.link} className="text-sm text-white hover:underline transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Registered Office */}
          <div className="col-span-2">
            <h4 className="text-gray-400 text-xs font-medium mb-3 uppercase tracking-wider">
              Registered Office Address
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              BuyKart Internet Private Limited,
              <br />
              Buildings Alyssa, Begonia &<br />
              Clove Embassy Tech Village,
              <br />
              Outer Ring Road, Devarabeesanahalli Village,
              <br />
              Bengaluru, 560103,
              <br />
              Karnataka, India
            </p>
            <div className="mt-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-sm text-white">1800-202-9898</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Features */}
          <div className="flex flex-wrap gap-6 md:gap-10">
            {[
              { icon: "🏪", label: "Become a Seller" },
              { icon: "🎁", label: "Gift Cards" },
              { icon: "❓", label: "Help Center" },
            ].map((item) => (
              <motion.a
                key={item.label}
                href="#"
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-sm text-white"
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">We accept:</span>
            <div className="flex gap-2">
              {["VISA", "MC", "AMEX", "UPI", "COD"].map((method) => (
                <div
                  key={method}
                  className="w-10 h-6 bg-white rounded flex items-center justify-center text-[9px] font-bold text-gray-700"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>© {new Date().getFullYear()} BuyKart.com</span>
          </div>
          <div className="flex items-center gap-4">
            {[
              {
                icon: "fb",
                svg: "M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z",
              },
              {
                icon: "tw",
                svg: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",
              },
              {
                icon: "ig",
                svg: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
              },
            ].map((social) => (
              <a key={social.icon} href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.svg} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
