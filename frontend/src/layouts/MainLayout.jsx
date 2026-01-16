"use client"

import PropTypes from "prop-types"
import { Outlet, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Header from "./Header"
import Footer from "./Footer"

const MainLayout = ({ children }) => {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f3f6]">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <div key={location.pathname}>{children || <Outlet />}</div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

MainLayout.propTypes = {
  children: PropTypes.node,
}

export default MainLayout
