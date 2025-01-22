"use client"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"

const First = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"]

  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="max-w-5xl mx-auto px-4 py-16 flex flex-col items-center justify-center"
    >
      <motion.div variants={itemVariants} className="text-center mb-4">
        <h1 className="text-4xl font-semibold mb-2">
          Why choose <span className="text-gray-500">FlowSpace</span>?
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Decide if you want to throw it away or retain it and continue with your workflow unhindered. Need short bursts
          of productivity?
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 items-center mt-16 justify-center">
        <motion.div variants={containerVariants} className="space-y-8">
          <motion.span
            variants={itemVariants}
            className="px-4 py-1 text-sm bg-gradient-to-r text-transparent bg-clip-text border-2 border-gradient from-indigo-500 to-rose-500 rounded-full"
          >
            Task Management
          </motion.span>

          <motion.h2 variants={itemVariants} className="text-3xl font-semibold">
            Efficiently manage your tasks <br /> with our intuitive <br /> interface.
          </motion.h2>

          <motion.p variants={itemVariants} className="text-gray-600">
            Stay organised, track progress seamlessly, and accomplish <br />
            more with tools designed to simplify your workflow.
          </motion.p>

          <motion.ul variants={containerVariants} className="space-y-4">
            <motion.li variants={itemVariants} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-600"></div>
              <span>Assign tasks and manage deadlines.</span>
            </motion.li>
            <motion.li variants={itemVariants} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-600"></div>
              <span>Prioritize tasks and keep your team aligned.</span>
            </motion.li>
          </motion.ul>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-indigo-900 text-white rounded-full hover:bg-indigo-800 transition-colors"
          >
            Start for free
          </motion.button>
        </motion.div>

        {/* Centered Div */}
        <motion.div variants={itemVariants} className="flex items-center justify-center ml-10">
          <div className="relative w-[380px] h-[380px] bg-gray-50 rounded-3xl p-11">
            {/* Avatar in top right */}
            <motion.div variants={itemVariants} className="absolute -top-4 -right-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden">
                <img src="./2.png" alt="User avatar" className="rounded-full w-full h-full" />
                <div className="absolute inset-0 border-8 border-t-orange-300 border-l-orange-300 border-b-transparent border-r-transparent rounded-full pointer-events-none"></div>
              </div>
            </motion.div>

            {/* Main white card */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl h-[calc(100%-10px)] p-6">
              {/* Chart */}
              <div className="mb-1 h-[120px]">
                <div className="relative ">
                  <div className="absolute w-full h-full">
                    <svg className="w-full h-full">
                      <motion.path
                        d="M 30 60 Q 90 30, 150 50 T 270 40"
                        fill="none"
                        stroke="#FF9F43"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                      <motion.circle cx="30" cy="60" r="3" fill="#FF9F43" variants={itemVariants} />
                      <motion.circle cx="150" cy="50" r="3" fill="#FF9F43" variants={itemVariants} />
                      <motion.circle cx="270" cy="40" r="3" fill="#FF9F43" variants={itemVariants} />
                    </svg>
                  </div>
                  <div className="flex items-end justify-around px-2">
                    {[16, 24, 12, 28, 16, 20].map((height, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        custom={index}
                        className={`w-6 ${index % 2 ? "bg-purple-500" : "bg-blue-500"} rounded`}
                        style={{ height: `${height * 3}px` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-around px-2 mt-1 text-xs text-gray-500">
                  {days.map((day) => (
                    <div key={day} className="w-6 text-center">
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              {/* User list */}
              <motion.div variants={containerVariants} className="space-y-3 px-2">
                {[
                  { name: "Guy Hawkins", amount: "$739.65" },
                  { name: "Marvin McKinney", amount: "$710.68" },
                  { name: "Devon Lane", amount: "$943.65" },
                ].map((user, index) => (
                  <motion.div key={index} variants={itemVariants} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-100">
                        <img src="./1.png" alt="User avatar" className="rounded-full" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">Staff</div>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-gray-900">{user.amount}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default First

