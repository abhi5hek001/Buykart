"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addToCart } from "../../features/cart/cartSlice"
import { toggleWishlist, selectIsInWishlist } from "../../features/wishlist/wishlistSlice"
import { formatPrice } from "../../utils/formatters"

const CarouselProductCard = ({ product, index }) => {
  const dispatch = useDispatch()
  const { id, name, price, imageUrl, stock } = product
  const isInWishlist = useSelector(selectIsInWishlist(id))

  const originalPrice = Math.round(Number(price) * 1.2)
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({ id, name, price: Number(price), imageUrl, quantity: 1 }))
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleWishlist({ id, name, price: Number(price), imageUrl }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="min-w-[180px] sm:min-w-[200px] bg-white rounded-sm overflow-hidden group cursor-pointer"
    >
      <Link to={`/products/${id}`} className="block">
        <div className="relative p-3 bg-white">
          <img
            src={imageUrl || "/placeholder.svg?height=150&width=150&query=product"}
            alt={name}
            className="w-full h-32 sm:h-40 object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=150&width=150"
            }}
          />

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg
              className={`w-4 h-4 ${isInWishlist ? "text-red-500 fill-current" : "text-gray-400"}`}
              fill={isInWishlist ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </motion.button>

          {discountPercent >= 15 && (
            <span className="absolute top-2 left-2 bg-[#388e3c] text-white text-[10px] px-1.5 py-0.5 rounded-sm font-medium animate-bounce-subtle">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <div className="p-3 border-t border-gray-50">
          <h3 className="text-xs sm:text-sm text-gray-800 line-clamp-2 h-8 sm:h-10 font-medium group-hover:text-[#2874f0] transition-colors">
            {name}
          </h3>

          <div className="mt-2 flex items-center gap-1">
            <span className="bg-[#388e3c] text-white text-[10px] px-1 py-0.5 rounded-sm flex items-center gap-0.5">
              4.2
              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-1 flex-wrap">
            <span className="text-sm sm:text-base font-semibold text-gray-900">{formatPrice(price)}</span>
            <span className="text-[10px] sm:text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

CarouselProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
}

const ProductCarousel = ({ title, products, viewAllLink, icon, bgColor = "white", showTimer = false }) => {
  const carouselRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 34, seconds: 56 })

  useEffect(() => {
    if (showTimer) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          let { hours, minutes, seconds } = prev
          seconds--
          if (seconds < 0) {
            seconds = 59
            minutes--
          }
          if (minutes < 0) {
            minutes = 59
            hours--
          }
          if (hours < 0) {
            hours = 23
            minutes = 59
            seconds = 59
          }
          return { hours, minutes, seconds }
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [showTimer])

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener("scroll", checkScroll)
      return () => carousel.removeEventListener("scroll", checkScroll)
    }
  }, [products])

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  if (!products || products.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm rounded-sm overflow-hidden"
    >
      <div className={`flex items-center justify-between p-4 ${bgColor !== "white" ? bgColor : ""}`}>
        <div className="flex items-center gap-4">
          {icon && <span className="text-2xl">{icon}</span>}
          <div>
            <h2 className={`text-lg sm:text-xl font-semibold ${bgColor !== "white" ? "text-white" : "text-gray-800"}`}>
              {title}
            </h2>
            {showTimer && (
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs ${bgColor !== "white" ? "text-white/80" : "text-gray-500"}`}>Ends in</span>
                <div className="flex items-center gap-1">
                  {[
                    { value: timeLeft.hours, label: "h" },
                    { value: timeLeft.minutes, label: "m" },
                    { value: timeLeft.seconds, label: "s" },
                  ].map((item, i) => (
                    <span key={i} className="flex items-center">
                      <span className="bg-gray-900 text-white text-xs px-1.5 py-0.5 rounded font-mono">
                        {String(item.value).padStart(2, "0")}
                      </span>
                      <span className={`text-xs ml-0.5 ${bgColor !== "white" ? "text-white/60" : "text-gray-400"}`}>
                        {item.label}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {viewAllLink && (
          <Link
            to={viewAllLink}
            className={`px-6 py-2 rounded-sm font-medium text-sm transition-colors ${
              bgColor !== "white"
                ? "bg-white text-[#2874f0] hover:bg-gray-100"
                : "bg-[#2874f0] text-white hover:bg-[#1a5dc4]"
            }`}
          >
            VIEW ALL
          </Link>
        )}
      </div>

      <div className="relative">
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-20 bg-white shadow-lg rounded-r flex items-center justify-center hover:bg-gray-50"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        )}

        <div ref={carouselRef} className="flex gap-3 overflow-x-auto scroll-smooth hide-scrollbar p-4 pt-0">
          {products.map((product, index) => (
            <CarouselProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-20 bg-white shadow-lg rounded-l flex items-center justify-center hover:bg-gray-50"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

ProductCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
  viewAllLink: PropTypes.string,
  icon: PropTypes.string,
  bgColor: PropTypes.string,
  showTimer: PropTypes.bool,
}

export default ProductCarousel
