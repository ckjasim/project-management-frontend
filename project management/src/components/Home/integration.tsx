"use client"

import React from "react"
import { motion, useInView } from "framer-motion"

const IntegrationSection = () => {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      className="flex items-center justify-between max-w-4xl mx-auto py-16 gap-16"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left side content */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.span
          className="inline-block px-4 py-1 text-sm bg-gradient-to-r text-transparent bg-clip-text border border-gradient-to-r from-indigo-500 to-rose-500 rounded-full"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Integration
        </motion.span>

        <motion.h2
          className="text-4xl font-semibold mt-6 mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          Integrate with popular <br />
          tools to streamline your <br /> workflow.
        </motion.h2>

        <motion.p
          className="text-gray-600 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          Integrating with popular tools centralizes tasks, automates <br />
          processes, and improves collaboration, saving time and boosting <br />
          productivity.
        </motion.p>

        <motion.button
          className="px-6 py-2 bg-indigo-900 text-white rounded-full hover:bg-indigo-800 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start for free
        </motion.button>
      </motion.div>

      {/* Right side content */}
      <motion.div
        className="relative w-96 h-96 bg-gray-50 rounded-3xl p-7 pb-12 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.img
          src="./Group 328.png"
          alt="Integration illustration"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
      </motion.div>
    </motion.div>
  )
}

export default IntegrationSection

