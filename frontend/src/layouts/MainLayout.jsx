import { useEffect } from "react"
import PropTypes from "prop-types"
import { Outlet, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AnimatePresence } from "framer-motion"
import Header from "./Header"
import Footer from "./Footer"
import { setupUserListeners } from "../features/user/userSlice"
import { setupCartListeners } from "../features/cart/cartSlice"
import { setupWishlistListeners } from "../features/wishlist/wishlistSlice"

const MainLayout = ({ children }) => {
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    // Initialize listeners for cross-tab synchronization
    dispatch(setupUserListeners())
    dispatch(setupCartListeners())
    dispatch(setupWishlistListeners())
  }, [dispatch])

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
