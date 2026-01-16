"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useGetProductsQuery, useGetCategoriesQuery } from "../../api/apiSlice"
import ProductCard from "../../components/product/ProductCard"
import SkeletonCard from "../../components/common/SkeletonCard"
import Spinner from "../../components/common/Spinner"
import PageTransition from "../../components/common/PageTransition"
import { useDebounce } from "../../hooks/useDebounce"

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [sortBy, setSortBy] = useState("relevance")
  const [showFilters, setShowFilters] = useState(false)

  const debouncedSearchQuery = useDebounce(searchQuery, 400)

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductsQuery({
    category: selectedCategory,
    search: debouncedSearchQuery,
  })

  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery()

  let products = productsData?.data || []
  const categories = categoriesData?.data || []

  // Apply client-side sorting
  if (sortBy === "price_low") {
    products = [...products].sort((a, b) => Number(a.price) - Number(b.price))
  } else if (sortBy === "price_high") {
    products = [...products].sort((a, b) => Number(b.price) - Number(a.price))
  }

  // Apply price filter
  products = products.filter((p) => {
    const price = Number(p.price)
    return price >= priceRange[0] && price <= priceRange[1]
  })

  // Scroll to top when the page loads or mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategory) params.set("category", selectedCategory)
    if (searchQuery) params.set("search", searchQuery)
    setSearchParams(params)
  }, [selectedCategory, searchQuery, setSearchParams])

  useEffect(() => {
    const search = searchParams.get("search")
    if (search) setSearchQuery(search)
  }, [searchParams])

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? "" : categoryId)
  }

  const clearFilters = () => {
    setSelectedCategory("")
    setSearchQuery("")
    setPriceRange([0, 100000])
    setSortBy("relevance")
  }

  const activeFiltersCount = [selectedCategory, priceRange[0] > 0 || priceRange[1] < 100000].filter(Boolean).length

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="flex gap-4 sm:gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="w-56 lg:w-64 shrink-0 hidden lg:block">
            <div className="bg-white rounded-sm shadow-sm sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800 uppercase text-sm tracking-wide">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="text-[#2874f0] text-xs font-medium hover:underline">
                      CLEAR ALL
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-medium text-gray-800 text-xs uppercase tracking-wider mb-3">Categories</h3>
                {categoriesLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedCategory === String(category.id)}
                            onChange={() => handleCategoryChange(String(category.id))}
                            className="w-4 h-4 text-[#2874f0] rounded border-gray-300 focus:ring-[#2874f0]"
                          />
                          <span className="text-sm text-gray-600 group-hover:text-[#2874f0] transition-colors">
                            {category.name}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Price Range */}
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-medium text-gray-800 text-xs uppercase tracking-wider mb-3">Price</h3>
                <div className="space-y-3">
                  {[
                    { label: "Under ₹1,000", min: 0, max: 1000 },
                    { label: "₹1,000 - ₹5,000", min: 1000, max: 5000 },
                    { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
                    { label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
                    { label: "Above ₹20,000", min: 20000, max: 100000 },
                  ].map((range) => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={priceRange[0] === range.min && priceRange[1] === range.max}
                        onChange={() => setPriceRange([range.min, range.max])}
                        className="w-4 h-4 text-[#2874f0] border-gray-300 focus:ring-[#2874f0]"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-[#2874f0] transition-colors">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Customer Ratings */}
              <div className="p-4">
                <h3 className="font-medium text-gray-800 text-xs uppercase tracking-wider mb-3">Customer Ratings</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#2874f0] rounded border-gray-300 focus:ring-[#2874f0]"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-[#2874f0] transition-colors flex items-center gap-1">
                        {rating}
                        <svg className="w-3 h-3 text-[#388e3c]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        & above
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="bg-white rounded-sm shadow-sm p-3 sm:p-4 mb-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-base sm:text-lg font-semibold text-gray-800">
                    {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
                  </h1>
                  {!productsLoading && (
                    <p className="text-xs sm:text-sm text-gray-500">Showing {products.length} products</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-sm text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="bg-[#2874f0] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2874f0] bg-white"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : productsError ? (
              <div className="bg-white rounded-sm shadow-sm p-8 text-center">
                <div className="text-red-500 text-lg mb-2">Failed to load products</div>
                <p className="text-gray-500 text-sm">
                  {productsError?.data?.error || "Something went wrong. Please try again."}
                </p>
              </div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-sm shadow-sm p-8 text-center"
              >
                <img src="no-product-found.png" alt="No results" className="h-40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-[#2874f0] text-white rounded-sm text-sm font-medium hover:bg-[#1a65d6] transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                <AnimatePresence>
                  {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Modal */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setShowFilters(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-80 max-w-full bg-white z-50 lg:hidden overflow-y-auto"
              >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                  <h2 className="font-semibold text-gray-800">Filters</h2>
                  <button onClick={() => setShowFilters(false)} className="p-1">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Categories */}
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-gray-800 text-sm mb-3">Categories</h3>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategory === String(category.id)}
                            onChange={() => handleCategoryChange(String(category.id))}
                            className="w-4 h-4 text-[#2874f0] rounded"
                          />
                          <span className="text-sm text-gray-600">{category.name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Range */}
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-gray-800 text-sm mb-3">Price</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Under ₹1,000", min: 0, max: 1000 },
                      { label: "₹1,000 - ₹5,000", min: 1000, max: 5000 },
                      { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
                      { label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
                      { label: "Above ₹20,000", min: 20000, max: 100000 },
                    ].map((range) => (
                      <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="mobilePrice"
                          checked={priceRange[0] === range.min && priceRange[1] === range.max}
                          onChange={() => setPriceRange([range.min, range.max])}
                          className="w-4 h-4 text-[#2874f0]"
                        />
                        <span className="text-sm text-gray-600">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <div className="p-4 sticky bottom-0 bg-white border-t border-gray-200">
                  <div className="flex gap-3">
                    <button
                      onClick={clearFilters}
                      className="flex-1 py-2.5 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="flex-1 py-2.5 bg-[#2874f0] text-white rounded-sm text-sm font-medium hover:bg-[#1a65d6]"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

export default ProductListing
