"use client"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"

const trustedCompanies = [
  { name: "Converse", label: "CONVERSE", image: "./spotify.png" },
  { name: "Netflix", label: "NETFLIX", image: "./netflix.png" },
  { name: "Slack", label: "Slack", image: "./slack.png" },
  { name: "Shazam", label: "SHAZAM", image: "./bing.png" },
  { name: "Prada", label: "PRADA", image: "./adidas.png" },
]

const TrustedBy = () => {
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

  return (
    <div ref={ref}>
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <div className="text-center mb-12">
          <motion.p
            className="text-gray-600 text-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ duration: 0.5 }}
            variants={{
              visible: { opacity: 1, y: 0 },
            }}
          >
            We are trusted by
          </motion.p>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-8">
          {trustedCompanies.map((company, index) => (
            <motion.div
              key={company.name}
              className="text-gray-400 font-medium text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              variants={{
                visible: { opacity: 1, y: 0 },
              }}
            >
              <img src={company.image || "/placeholder.svg"} alt={company.label} className="h-12 object-contain" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrustedBy

