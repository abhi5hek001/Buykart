"use client"

import { motion } from "framer-motion"
import PropTypes from "prop-types"

const AnimatedCard = ({ children, className = "", delay = 0, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{
        y: -4,
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

AnimatedCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  delay: PropTypes.number,
  onClick: PropTypes.func,
}

export default AnimatedCard
