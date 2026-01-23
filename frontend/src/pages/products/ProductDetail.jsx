"use client"

import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { useGetProductByIdQuery, useGetProductsQuery } from "../../api/apiSlice"
import { addToCart } from "../../features/cart/cartSlice"
import { toggleWishlist, selectIsInWishlist } from "../../features/wishlist/wishlistSlice"
import { formatPrice } from "../../utils/formatters"
import Button from "../../components/common/Button"
import Spinner from "../../components/common/Spinner"
import PageTransition from "../../components/common/PageTransition"
import { StockIndicator } from '../../components/stock/StockIndicator';

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const { data, isLoading, error } = useGetProductByIdQuery(id)
  const product = data?.data
  const isInWishlist = useSelector(selectIsInWishlist(Number(id)))

  // Fetch related products from the same category
  const { data: relatedData } = useGetProductsQuery(
    { category: product?.categoryId },
    { skip: !product?.categoryId }
  )
  const relatedProducts = relatedData?.data?.filter(p => p.id !== product?.id)?.slice(0, 6) || []

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          imageUrl: product.imageUrl,
          quantity,
        }),
      )
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate("/checkout")
  }

  const handleToggleWishlist = () => {
    if (product) {
      dispatch(
        toggleWishlist({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          imageUrl: product.imageUrl,
        }),
      )
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-sm shadow-sm p-8 text-center"
        >
          <img src="/placeholder.svg?height=150&width=150" alt="Not found" className="w-32 h-32 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Product not found</h2>
          <p className="text-gray-500 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/products")}>Browse Products</Button>
        </motion.div>
      </div>
    )
  }

  const originalPrice = Math.round(Number(product.price) * 1.2)
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100)

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="bg-white rounded-sm shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-sm p-4 bg-white">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    src={product.imageUrl || "/placeholder.svg?height=400&width=400&query=product"}
                    alt={product.name}
                    className="w-full max-h-80 sm:max-h-96 object-contain"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=400&width=400"
                    }}
                  />

                  {/* Wishlist Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleToggleWishlist}
                    className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
                  >
                    <svg
                      className={`w-6 h-6 ${isInWishlist ? "text-red-500 fill-current" : "text-gray-400"}`}
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
                </motion.div>
              </div>

              {/* Action Buttons - Fixed below image */}
              <div className="flex gap-3 sm:gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    variant="secondary"
                    size="lg"
                    fullWidth
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="bg-[#ff9f00] hover:bg-[#f39200] gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={addedToCart ? "added" : "add"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {addedToCart ? "ADDED!" : "ADD TO CART"}
                      </motion.span>
                    </AnimatePresence>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className="bg-[#fb641b] hover:bg-[#f85606] gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    BUY NOW
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Product Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              {/* Breadcrumb */}
              <nav className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                <Link to="/" className="hover:text-[#2874f0]">
                  Home
                </Link>
                <span>/</span>
                <Link to="/products" className="hover:text-[#2874f0]">
                  Products
                </Link>
                <span>/</span>
                <span className="text-gray-800 line-clamp-1">{product.name}</span>
              </nav>

              {/* Title */}
              <h1 className="text-lg sm:text-xl font-medium text-gray-800 leading-relaxed">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <span className="bg-[#388e3c] text-white text-sm px-2.5 py-1 rounded-sm flex items-center gap-1 font-medium">
                  4.2
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
                <span className="text-gray-500 text-sm">1,234 Ratings & 256 Reviews</span>
                <span className="text-[#2874f0] text-xs font-medium bg-blue-50 px-2 py-0.5 rounded">
                  BuyKart Assured
                </span>
              </div>

              {/* Price Section */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-semibold text-gray-900">{formatPrice(product.price)}</span>
                  <span className="text-base sm:text-lg text-gray-400 line-through">{formatPrice(originalPrice)}</span>
                  <span className="text-base sm:text-lg text-[#388e3c] font-medium">{discountPercent}% off</span>
                </div>
                <p className="text-sm text-[#388e3c]">inclusive of all taxes</p>
              </div>

              {/* Offers */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-800">Available offers</h3>
                {[
                  { icon: "🏷️", text: "Bank Offer: 5% Cashback on BuyKart Axis Bank Card" },
                  { icon: "🎉", text: "Special Price: Get extra 10% off (price inclusive of cashback/coupon)" },
                  { icon: "💳", text: "No cost EMI starting from ₹1,500/month" },
                ].map((offer, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span>{offer.icon}</span>
                    <span className="text-gray-600">{offer.text}</span>
                  </div>
                ))}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <div className="text-gray-700 mb-1 text-sm">Stock Status</div>  
                <StockIndicator productId={product.id} />
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-sm">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </motion.button>
                    <span className="px-4 py-1.5 border-x border-gray-300 font-medium">{quantity}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Highlights */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="font-medium text-gray-800 mb-3">Highlights</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {[
                    "Premium quality product",
                    "7 days replacement policy",
                    "Cash on Delivery available",
                    "GST invoice available",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-t border-gray-100 pt-5">
                  <h3 className="font-medium text-gray-800 mb-3">Description</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Delivery Info */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="font-medium text-gray-800 mb-3">Delivery & Services</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: "🚚", label: "Free Delivery", desc: "On orders above ₹500" },
                    { icon: "↩️", label: "7 Days Return", desc: "Easy returns" },
                    { icon: "💳", label: "Pay on Delivery", desc: "Cash/UPI/Card" },
                    { icon: "✓", label: "Warranty", desc: "1 Year warranty" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* You might be interested in - Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-white rounded-sm shadow-sm p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                You might be interested in
              </h2>
              <Link 
                to={`/products?category=${product.categoryId}`}
                className="text-[#2874f0] text-sm font-medium hover:underline"
              >
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {relatedProducts.map((relatedProduct) => {
                const relatedOriginalPrice = Math.round(Number(relatedProduct.price) * 1.2)
                const relatedDiscount = Math.round(((relatedOriginalPrice - relatedProduct.price) / relatedOriginalPrice) * 100)
                
                return (
                  <Link
                    key={relatedProduct.id}
                    to={`/products/${relatedProduct.id}`}
                    className="group bg-white border border-gray-100 rounded-sm p-3 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative aspect-square mb-3 overflow-hidden">
                      <img
                        src={relatedProduct.imageUrl || "/placeholder.svg?height=150&width=150"}
                        alt={relatedProduct.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=150&width=150"
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-800 line-clamp-2 mb-1 group-hover:text-[#2874f0] transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-baseline gap-1 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(relatedProduct.price)}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(relatedOriginalPrice)}
                        </span>
                        <span className="text-xs text-[#388e3c] font-medium">
                          {relatedDiscount}% off
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="bg-[#388e3c] text-white text-xs px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                          4.2
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}

export default ProductDetail
