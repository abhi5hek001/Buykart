import { useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addToCart } from "../../features/cart/cartSlice"
import { toggleWishlist, selectIsInWishlist } from "../../features/wishlist/wishlistSlice"
import { StockBadge } from '../stock/StockIndicator';


const formatPrice = (price) => {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

const ProductCard = ({ product, index = 0 }) => {
  const dispatch = useDispatch()
  const [addedToCart, setAddedToCart] = useState(false)
  const { id, name, price, imageUrl, stock, description } = product
  const isInWishlist = useSelector(selectIsInWishlist(id))

  const originalPrice = Math.round(Number(price) * 1.2)
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({
      id,
      name,
      price: Number(price),
      imageUrl,
      quantity: 1
    }))
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleWishlist({
      id,
      name,
      price: Number(price),
      imageUrl
    }))
  }

  return (
    <div
      className="bg-white rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer"
      style={{
        opacity: 0,
        animation: `fadeInUp 0.4s ease-out ${index * 50}ms forwards`
      }}
    >
      <Link to={`/products/${id}`} className="block">
        {/* Image Container */}
        <div className="relative p-4 bg-white">
          <img
            src={imageUrl || `https://via.placeholder.com/200?text=${encodeURIComponent(name)}`}
            alt={name}
            loading="lazy"
            className="w-full h-44 object-contain transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/200/e5e7eb/374151?text=No+Image'
            }}
          />

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 z-10"
          >
            <svg
              className={`w-5 h-5 ${isInWishlist ? "text-red-500 fill-current" : "text-gray-400"}`}
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
          </button>

          {/* Stock Badge */}
          <StockBadge productId={id} />

          {stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 text-sm font-medium rounded">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 pt-3 border-t border-gray-100">
          {/* Title */}
          <h3 className="text-sm font-normal text-gray-800 line-clamp-2 h-10 mb-2 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5 font-medium">
              4.2
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
            <span className="text-gray-400 text-xs">(1,234)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-medium text-gray-900">{formatPrice(price)}</span>
            <span className="text-sm text-gray-400 line-through">{formatPrice(originalPrice)}</span>
            <span className="text-sm text-green-600 font-medium">{discountPercent}% off</span>
          </div>

          {/* Free Delivery */}
          <p className="text-xs text-gray-600 mb-3">Free delivery</p>

          {/* Add to Cart Button - Flipkart style */}
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`
              w-full py-2.5 text-sm font-semibold rounded transition-all
              ${
                stock === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#ff9f00] hover:bg-[#f39200] text-white active:scale-98"
              }
            `}
          >
            {stock === 0 ? "OUT OF STOCK" : addedToCart ? "ADDED!" : "ADD TO CART"}
          </button>
        </div>
      </Link>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default ProductCard