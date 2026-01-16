"use client"

import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { selectCartItems, selectCartSubtotal, updateQuantity, removeFromCart } from "../../features/cart/cartSlice"
import { formatPrice } from "../../utils/formatters"
import Button from "../../components/common/Button"
import PageTransition from "../../components/common/PageTransition"

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartItems = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)

  const handleQuantityChange = (id, newQuantity) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }))
  }

  const handleRemove = (id) => {
    dispatch(removeFromCart(id))
  }

  const deliveryCharge = subtotal > 500 ? 0 : 40
  const discount = Math.round(subtotal * 0.15)
  const total = subtotal + deliveryCharge

  if (cartItems.length === 0) {
    return (
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-sm shadow-sm p-8 text-center"
          >
            <img
              src="empty-cart.png"
              alt="Empty Cart"
              className="w-40 h-40 mx-auto mb-6 object-contain"
            />
            <h2 className="text-xl font-medium text-gray-800 mb-2">Your cart is empty!</h2>
            <p className="text-gray-500 mb-6">Add items to it now.</p>
            <Button onClick={() => navigate("/products")}>Shop Now</Button>
          </motion.div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-sm shadow-sm">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h1 className="text-lg font-medium text-gray-800">My Cart ({cartItems.length})</h1>
                <span className="text-sm text-gray-500">
                  Deliver to: <span className="font-medium text-gray-800">560001</span>
                </span>
              </div>

              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border-b border-gray-100 flex gap-4"
                  >
                    <Link to={`/products/${item.id}`} className="shrink-0">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={item.imageUrl || "/placeholder.svg?height=100&width=100&query=product"}
                        alt={item.name}
                        className="w-20 sm:w-24 h-20 sm:h-24 object-contain"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.id}`}
                        className="text-sm sm:text-base text-gray-800 font-medium hover:text-[#2874f0] transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>

                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-base sm:text-lg font-semibold text-gray-900">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                          {formatPrice(item.price * 1.2)}
                        </span>
                        <span className="text-xs sm:text-sm text-[#388e3c] font-medium">15% off</span>
                      </div>

                      <div className="mt-3 sm:mt-4 flex items-center gap-3 sm:gap-4 flex-wrap">
                        <div className="flex items-center border border-gray-300 rounded-sm">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            −
                          </motion.button>
                          <span className="w-8 sm:w-10 h-7 sm:h-8 flex items-center justify-center border-x border-gray-300 font-medium text-sm">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            +
                          </motion.button>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemove(item.id)}
                          className="text-gray-500 hover:text-red-500 text-xs sm:text-sm font-medium uppercase transition-colors"
                        >
                          REMOVE
                        </motion.button>
                      </div>
                    </div>

                    <div className="text-right shrink-0 hidden sm:block">
                      <span className="text-lg font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="p-4 flex justify-end lg:hidden">
                <Button fullWidth size="lg" onClick={() => navigate("/checkout")}>
                  PLACE ORDER
                </Button>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:w-96 shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-sm shadow-sm sticky top-28"
            >
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-gray-500 font-medium uppercase text-sm">Price Details</h2>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price ({cartItems.length} items)</span>
                  <span className="text-gray-900">{formatPrice(subtotal + discount)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-[#388e3c]">− {formatPrice(discount)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  {deliveryCharge === 0 ? (
                    <span className="text-[#388e3c]">FREE</span>
                  ) : (
                    <span className="text-gray-900">{formatPrice(deliveryCharge)}</span>
                  )}
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <p className="text-[#388e3c] text-sm font-medium">
                  You will save {formatPrice(discount)} on this order
                </p>
              </div>

              <div className="p-4 border-t border-gray-100 hidden lg:block">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button fullWidth size="lg" onClick={() => navigate("/checkout")}>
                    PLACE ORDER
                  </Button>
                </motion.div>
              </div>

              <div className="p-4 pt-0 flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs text-gray-500">
                  Safe and Secure Payments. Easy returns. 100% Authentic products.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default Cart
