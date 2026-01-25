"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { selectCartTotalQuantity, switchUserCart } from "../features/cart/cartSlice"
import { selectWishlistCount, switchUserWishlist } from "../features/wishlist/wishlistSlice"
import { selectCurrentUser, logout, selectIsAuthenticated } from "../features/user/userSlice"
import { useGetCategoriesQuery, useGetProductsQuery } from "../api/apiSlice"
import { formatPrice } from "../utils/formatters"
import AuthModal from "../components/auth/AuthModal"

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const cartCount = useSelector(selectCartTotalQuantity)
  const currentUser = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)

  const { data: categoriesData } = useGetCategoriesQuery()
  const categories = categoriesData?.data || []

  // Sync Cart and Wishlist when User changes (local or cross-tab)
  useEffect(() => {
    const userId = currentUser?.id || 'guest'
    dispatch(switchUserCart(userId))
    dispatch(switchUserWishlist(userId))
  }, [currentUser?.id, dispatch])

  // Debounced search query for autocomplete
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch products for autocomplete
  const { data: searchResults, isFetching: isSearching } = useGetProductsQuery(
    { search: debouncedQuery },
    { skip: debouncedQuery.length < 2 }
  )
  const products = searchResults?.data?.slice(0, 8) || []

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setShowMobileMenu(false)
    setShowDropdown(false)
    setShowSearchDropdown(false)
    setSearchQuery("")
  }, [location])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearchDropdown(false)
    }
  }

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`)
    setShowSearchDropdown(false)
    setSearchQuery("")
  }

  return (
    <header className="sticky top-0 z-50 shadow-md w-full">
      {/* Main Header */}
      <div className="bg-[#2874f0] text-white py-2.5">
        <div className="max-w-[1248px] mx-auto px-4 flex items-center justify-center sm:justify-between gap-4 md:gap-10">

          {/* Logo Section */}
          <Link to="/" className="flex flex-col items-start leading-none shrink-0 group">
            <span className="text-xl sm:text-[22px] font-bold italic tracking-tight leading-none">
              BuyKart
            </span>
            <span className="text-[10px] sm:text-[11px] text-white italic mt-0.5 group-hover:underline flex items-center">
              Explore <span className="text-[#ffe500] font-bold mx-0.5">Plus</span>
              <img
                src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/plus_aef861.png"
                alt="Plus"
                className="w-2.5 h-2.5"
              />
            </span>
          </Link>

          {/* Search Bar with Autocomplete */}
          <form ref={searchRef} onSubmit={handleSearch} className="flex-1 max-w-[564px] hidden sm:block relative">
            <div className="relative flex items-center bg-white rounded-sm shadow-sm h-9">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Search for products, brands and more"
                className="w-full px-4 text-[14px] text-black placeholder-gray-500 focus:outline-none"
              />
              <button type="submit" className="px-3 text-[#2874f0] hover:opacity-80">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </button>
            </div>

            {/* Search Dropdown */}
            <AnimatePresence>
              {showSearchDropdown && (searchQuery.length >= 2 || products.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  {isSearching ? (
                    <div className="py-4 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-[#2874f0] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : products.length > 0 ? (
                    <div className="max-h-[400px] overflow-y-auto">
                      {products.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left"
                        >
                          <img
                            src={product.imageUrl || 'https://via.placeholder.com/48'}
                            alt={product.name}
                            className="w-12 h-12 object-contain shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 font-medium truncate">{product.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</span>
                              {product.categoryId && (
                                <span className="text-xs text-gray-400">
                                  in {categories.find(c => c.id === product.categoryId)?.name || 'Products'}
                                </span>
                              )}
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                      {/* View All Results */}
                      <button
                        onClick={handleSearch}
                        className="w-full py-3 text-center text-[#2874f0] font-medium text-sm hover:bg-blue-50 transition-colors"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  ) : debouncedQuery.length >= 2 ? (
                    <div className="py-6 text-center text-gray-500 text-sm">
                      No products found for "{searchQuery}"
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Nav Actions */}
          <nav className="flex items-center gap-6 md:gap-9">

            {/* Login / Profile */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button
                onClick={() => !isAuthenticated && setShowAuthModal(true)}
                className="bg-white text-[#2874f0] px-4 py-1 font-semibold text-[15px] rounded-sm hidden sm:flex items-center gap-2 hover:bg-white/95 transition-all outline-none"
              >
                {isAuthenticated ? (
                  <>
                    {currentUser?.name || 'My Account'}
                    <svg className={`w-3 h-3 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                ) : (
                  'Login'
                )}
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-1/2 -translate-x-1/2 mt-0 pt-3 w-64 z-50"
                  >
                    {/* Tooltip Arrow */}
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-10 border-l-transparent border-r-10 border-r-transparent border-b-10 border-white shadow-sm" />

                    <div className="bg-white rounded-sm shadow-2xl border border-gray-100 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                        <div className="flex flex-col">
                          <span className="text-black text-sm font-semibold">Hello, {currentUser?.name || 'Friend'}</span>
                          {isAuthenticated && <span className="text-[10px] text-gray-500">{currentUser?.email}</span>}
                        </div>
                        {isAuthenticated && (
                          <Link to="/dashboard?tab=account" className="text-[#2874f0] text-xs font-semibold hover:underline">My Profile</Link>
                        )}
                      </div>

                      {/* Menu Links */}
                      <div className="flex flex-col">
                        {[
                          { label: "My Profile", link: "/dashboard?tab=account", icon: <UserIcon />, protected: true },
                          { label: "Orders", link: "/dashboard?tab=orders", icon: <OrderIcon />, protected: true },
                          { label: "Wishlist", link: "/dashboard?tab=wishlist", icon: <HeartIcon />, protected: true },
                          { label: "Rewards", link: "#", icon: <RewardIcon />, protected: false },
                          { label: "Gift Cards", link: "#", icon: <GiftIcon />, protected: false },
                        ]
                          .filter(item => !item.protected || isAuthenticated)
                          .map((item) => (
                            <Link
                              key={item.label}
                              to={item.link}
                              className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                            >
                              <span className="text-[#2874f0]">{item.icon}</span>
                              {item.label}
                            </Link>
                          ))}

                        {isAuthenticated && (
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-800 hover:bg-gray-50 transition-colors text-left border-t border-gray-100"
                          >
                            <span className="text-red-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                            </span>
                            Logout
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Become a Seller */}
            <Link to="#" className="hidden lg:block font-semibold text-[15px] whitespace-nowrap hover:opacity-90">
              Become a Seller
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex items-center gap-2 group">
              <div className="relative">
                <svg className="w-[18px] h-[18px] fill-white" viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-[#ff6161] border border-[#2874f0] text-white text-[10px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold text-[15px]">Cart</span>
            </Link>

            {/* Mobile Search/Menu Toggle (Simplified for Mobile) */}
            <button className="sm:hidden text-white" onClick={() => setShowMobileMenu(true)}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              </svg>
            </button>
          </nav>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onOpenChange={setShowAuthModal} />

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 bg-black z-50 sm:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 shadow-xl overflow-y-auto sm:hidden"
            >
              {/* Header */}
              <div className="bg-[#2874f0] p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2874f0]">
                    <UserIcon />
                  </div>
                  <span className="font-semibold">Hello, {currentUser?.name || 'Guest'}</span>
                </div>
                <button onClick={() => setShowMobileMenu(false)} className="text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Links */}
              <div className="py-2">
                {[
                  { label: "My Profile", link: "/dashboard?tab=account", icon: <UserIcon />, protected: true },
                  { label: "Orders", link: "/dashboard?tab=orders", icon: <OrderIcon />, protected: true },
                  { label: "Wishlist", link: "/dashboard?tab=wishlist", icon: <HeartIcon />, protected: true },
                  { label: "Cart", link: "/cart", icon: <CartIcon />, protected: false },
                  { label: "Rewards", link: "#", icon: <RewardIcon />, protected: false },
                  { label: "Gift Cards", link: "#", icon: <GiftIcon />, protected: false },
                ]
                  .filter(item => !item.protected || isAuthenticated)
                  .map((item) => (
                    <Link
                      key={item.label}
                      to={item.link}
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <span className="text-[#2874f0] w-5 h-5">{item.icon}</span>
                      <span className="font-medium text-[15px]">{item.label}</span>
                    </Link>
                  ))}

                {!isAuthenticated ? (
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowAuthModal(true);
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
                  >
                    <span className="text-[#2874f0] w-5 h-5"><UserIcon /></span>
                    <span className="font-medium text-[15px]">Login / Signup</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3 text-red-600 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
                  >
                    <span className="w-5 h-5">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </span>
                    <span className="font-medium text-[15px]">Logout</span>
                  </button>
                )}
              </div>

              {/* Extra Links */}
              <div className="mt-2 border-t border-gray-100 py-2">
                <Link to="#" className="block px-4 py-3 text-gray-600 hover:bg-gray-50">Choose Language</Link>
                <Link to="#" className="block px-4 py-3 text-gray-600 hover:bg-gray-50">Offer Zone</Link>
                <Link to="#" className="block px-4 py-3 text-gray-600 hover:bg-gray-50">Sell on BuyKart</Link>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Search Bar Section */}
      <div className="sm:hidden bg-[#2874f0] px-4 pb-2">
        <div className="bg-white flex items-center rounded-sm h-9 px-3">
          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for Products, Brands and More"
            className="text-[13px] w-full focus:outline-none text-black"
          />
        </div>
      </div>
    </header>
  )
}

/* Internal SVG Components for Menu Icons */
const UserIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
const OrderIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 8l-8-4-8 4v8l8 4 8-4V8zm-8-2.12L18.12 9 12 12.12 5.88 9 12 5.88zM6 10.12l5 2.5v5.26l-5-2.5v-5.26zm12 7.76l-5 2.5v-5.26l5-2.5v5.26z" /></svg>
const HeartIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
const RewardIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" /></svg>
const GiftIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.65-.5-.65C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.41 12.25 12 8.66l3.59 3.59L17 10.83 14.92 8H20v6z" /></svg>
const CartIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" /></svg>

export default Header;