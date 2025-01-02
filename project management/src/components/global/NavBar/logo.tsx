import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Logo = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
       <div className="h-5 w-6 bg-yellow-100 dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0">
    <img
      src="/bird_2.jpg"
      alt="description"
      className="w-full h-full object-contain rounded-lg"
    />
  </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-yellow-100 dark:text-white whitespace-pre"
      >
        projectease
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
  to="#"
  className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
>
  <div className="h-5 w-6 bg-yellow-100 dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0">
    <img
      src="/bird_2.jpg"
      alt="description"
      className="w-full h-full object-contain rounded-lg"
    />
  </div>
</Link>

  );
};