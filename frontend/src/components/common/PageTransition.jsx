"use client"

import { motion } from "framer-motion"
import PropTypes from "prop-types"

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
}

const PageTransition = ({ children, className = "" }) => {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} className={className}>
      {children}
    </motion.div>
  )
}

PageTransition.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default PageTransition
