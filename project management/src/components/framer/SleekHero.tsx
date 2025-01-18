import { motion } from "framer-motion";
export const SleekHeroText = () => {
  const text = "Helping to manage your project effectively.";
  const words = text.split(" ");
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const characterVariants = {
    hidden: { 
      y: 100,
      opacity: 0,
      rotateX: -15
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 18,
        stiffness: 150,
        duration: 0.8
      }
    }
  };

  return (
    <motion.div
      className="text-[3.5rem] font-medium leading-tight mb-6 max-w-3xl mx-auto overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex flex-wrap justify-center">
        {words.map((word, wordIndex) => (
          <motion.span
            key={wordIndex}
            className="relative mx-2 overflow-hidden"
            variants={wordVariants}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-t from-blue-50/20 to-transparent blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + wordIndex * 0.15 }}
            />
            
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={charIndex}
                className="inline-block relative"
                variants={characterVariants}
                style={{ 
                  transformOrigin: "bottom",
                  perspective: "1000px"
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};