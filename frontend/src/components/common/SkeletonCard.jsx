"use client"

import { motion } from "framer-motion"

const SkeletonCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-sm shadow-sm overflow-hidden"
    >
      {/* Image skeleton */}
      <div className="w-full h-40 sm:h-48 bg-gray-200 animate-shimmer" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer" />

        {/* Rating */}
        <div className="h-4 bg-gray-200 rounded w-20 animate-shimmer" />

        {/* Price */}
        <div className="flex gap-2">
          <div className="h-5 bg-gray-200 rounded w-20 animate-shimmer" />
          <div className="h-5 bg-gray-200 rounded w-16 animate-shimmer" />
        </div>

        {/* Button */}
        <div className="h-9 bg-gray-200 rounded w-full animate-shimmer" />
      </div>
    </motion.div>
  )
}

export default SkeletonCard
