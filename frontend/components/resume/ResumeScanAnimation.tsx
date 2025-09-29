// frontend/components/resume/ResumeScanAnimation.tsx
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

export function ResumeScanAnimation() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 flex flex-col items-center justify-center p-8 space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="relative"
      >
        <motion.div
          className="relative w-64 h-96 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg shadow-lg overflow-hidden dark:from-gray-800 dark:to-gray-700"
          animate={{ 
            scale: [1, 1.02, 1],
            rotate: [0, 0.5, 0],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        >
          {/* Glowing scan line */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg"
            initial={{ y: -1 }}
            animate={{ y: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          {/* Subtle paper curl effect */}
          <motion.div
            className="absolute top-2 right-2 w-8 h-8 border border-gray-300 rounded-br-lg bg-white/80 dark:bg-gray-700/80"
            animate={{ rotate: [0, 2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Fake text lines with shimmer */}
          <div className="absolute inset-0 p-6 space-y-3 overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-4 bg-muted/50 rounded animate-pulse"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: i * 0.1, duration: 1.5 }}
              />
            ))}
          </div>
          {/* Progress indicator */}
          <motion.div
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-primary/20 rounded-full p-1"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div className="w-16 h-1 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="text-center space-y-2"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="inline-flex items-center gap-2"
        >
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm font-medium">Scanning resume and analyzing job requirements...</span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-muted-foreground"
        >
          This may take a moment while AI processes your documents.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}