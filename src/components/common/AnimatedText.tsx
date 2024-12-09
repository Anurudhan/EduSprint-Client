import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedParagraphProps {
  text: string;
}

const AnimatedText: React.FC<AnimatedParagraphProps> = ({ text }) => {
  const [key, setKey] = useState(0); 

  const words = text.split(" ");

  useEffect(() => {
    
    const interval = setInterval(() => {
      setKey((prevKey) => prevKey + 1);
    }, 6000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div key={key} className="text-gray-600 dark:text-gray-300">
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }}  
          transition={{
            delay: index * 0.3,  
            duration: 0.6,       // Duration of animation for each word
            ease: "easeOut",     // Smooth easing
          }}
          style={{
            display: "inline-block",
            marginRight: "8px", // Spacing between words
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText;
