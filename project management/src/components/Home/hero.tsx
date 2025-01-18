import { MousePointer2 } from 'lucide-react';
import { motion } from "framer-motion";
import { SleekHeroText } from '../framer/SleekHero';


const BeecompBackground = () => {
  return (
    <svg width="100%" height="100%" className="opacity-20 absolute top-0 left-0">
      <defs>
        <pattern 
          id="beecomp" 
          width="56"
          height="100"
          patternUnits="userSpaceOnUse"
          patternTransform="scale(1) rotate(0)"
        >
          <path 
            d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" 
            fill="none" 
            stroke="#FCD34D"
            strokeWidth="1"
          />
          <path 
            d="M28 0L28 34L0 50L0 16L28 0Z" 
            fill="#FEF3C7" 
            fillOpacity="0.3"
          />
          <path 
            d="M56 16L28 34L28 0L56 16Z" 
            fill="#FDE68A" 
            fillOpacity="0.3"
          />
          <path 
            d="M56 50L28 66L28 34L56 50Z" 
            fill="#FCD34D" 
            fillOpacity="0.2"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#beecomp)" />
    </svg>
  );
};

const HexBackground:React.FC<any> = ({ color }) => {
  const fills :any = {
    blue: { fill: '#DBEAFE' },
    green: { fill: '#DCFCE7' },
    violet: { fill: '#EDE9FE' },
    orange: { fill: '#FFEDD5' }
  };

  return (
    <svg width="56" height="66" viewBox="0 0 56 66" className="absolute -z-10 -top-2 -left-2">
      <path
        d="M28 0L56 16L56 50L28 66L0 50L0 16L28 0Z"
        fill={fills[color].fill}
      />
    </svg>
  );
};

const FeatureTag:React.FC<any> = ({ label, color, className, delay = 0 }) => {
  const colors:any = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-400' },
    green: { bg: 'bg-green-50', text: 'text-green-400' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-400' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-400' }
  };

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 1.2 + delay }}
    >
      <div className="relative inline-flex items-center p-2">
        <HexBackground color={color} />
        <motion.div 
          className="absolute -bottom-3 z-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 1.4 + delay }}
        >
          <MousePointer2 className={`w-6 h-6 ${colors[color].text}`} />
        </motion.div>
        <motion.div 
          className={`${colors[color].bg} -right-4 -bottom-14 px-4 py-1.5 rounded-md relative z-10`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 1.5 + delay }}
        >
          <span className={`${colors[color].text} text-xs font-medium`}>{label}</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

const AppContainer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      <BeecompBackground />
      
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-medium">TaskHive</h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 relative z-10">
        <div className="flex justify-center mt-8 mb-4">
          <motion.div 
            className="relative inline-block"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full p-[1px]">
              <div className="bg-white h-full w-full rounded-full"></div>
            </div>
            <div className="relative px-6 py-2">
              <p className="text-xs font-medium bg-gradient-to-r from-indigo-500 to-rose-500 bg-clip-text text-transparent">
                Join 4,000+ companies already growing
              </p>
            </div>
          </motion.div>
        </div>

        <div className="text-center relative z-10">
        <SleekHeroText/>


        <motion.p
  className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto"
  initial={{ opacity: 0, scale: 0.8 }} // Start with smaller scale and invisible
  animate={{ opacity: 1, scale: 1 }}   // Transition to full size and visible
  transition={{ duration: 0.5, delay: 1 }}
>
  Decide if you want to throw it away or retain it and continue with your workflow unhindered.
</motion.p>
<motion.div 
  className="flex justify-center space-x-4"
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }}
  transition={{ staggerChildren: 0.3, duration: 0.5}}
>
  <motion.button
    className="bg-[#7C3AED] text-white px-7 py-3 rounded-full"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{delay:1.5}}
  >
    Try it free
  </motion.button>
  <motion.button
    className="bg-gray-100 text-gray-700 px-7 py-3 rounded-full"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{delay:1.7}}
  >
    Learn more
  </motion.button>
</motion.div>

        </div>

        <div className="absolute z-0 top-32 w-full h-[500px]">
          <div className="absolute left-[8.5rem] top-[10.7rem]">
            <FeatureTag 
              label="Task Management" 
              color="blue"
              className="transform"
              delay={0.3}
            />
          </div>
          
          <div className="absolute left-[15.5rem] bottom-0 transform -translate-x-7 -translate-y-32">
            <FeatureTag 
              label="Reporting"
              color="green"
              className="transform"
              delay={0.6}
            />
          </div>
          
          <div className="absolute right-[12.5rem] -top-8 transform translate-x-1 ">
            <FeatureTag 
              label="Integration"
              color="violet"
              className="transform"
              delay={0.9}
            />
          </div>
          
          <div className="absolute right-72 bottom-32">
            <FeatureTag 
              label="Team Collaboration"
              color="orange"
              className="transform"
              delay={1.2}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppContainer;

