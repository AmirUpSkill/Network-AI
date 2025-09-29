// frontend/components/resume/ScanAnimation.tsx
'use client';

import { motion } from 'framer-motion';
import { FileText, Cpu, Zap, Scan } from 'lucide-react';

export function ScanAnimation() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="relative">
        {/* Document being scanned */}
        <motion.div
          className="relative w-64 h-80 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700"
          animate={{ rotateY: [0, 3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Scan line */}
          <motion.div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-80"
            initial={{ top: 0 }}
            animate={{ top: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* Secondary scan effect */}
          <motion.div
            className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-slate-300/60 to-transparent"
            initial={{ top: 0 }}
            animate={{ top: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.1 }}
          />

          {/* Document content lines */}
          <div className="p-6 space-y-3">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "h-2 bg-gray-600 rounded",
                  i === 0 && "h-3 w-3/4", // Title line
                  i === 1 && "h-1.5 w-1/2", // Subtitle
                  i % 4 === 0 && "w-5/6", // Longer lines
                  i % 3 === 0 && "w-3/4", // Medium lines
                )}
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: [0.3, 0.7, 0.3],
                  backgroundColor: ["rgb(75 85 99)", "rgb(100 116 139)", "rgb(75 85 99)"]
                }}
                transition={{
                  duration: 1.8,
                  delay: i * 0.1,
                  repeat: Infinity
                }}
              />
            ))}
          </div>

          {/* Scanning overlay effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-400/5 to-transparent"
            initial={{ y: '-100%' }}
            animate={{ y: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Floating analysis icons */}
        <motion.div
          className="absolute -top-12 -right-12 p-3 bg-gray-800/50 rounded-full border border-gray-700 backdrop-blur-sm"
          animate={{
            y: [0, -8, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Cpu className="h-5 w-5 text-slate-400" />
        </motion.div>

        <motion.div
          className="absolute -bottom-12 -left-12 p-3 bg-gray-800/50 rounded-full border border-gray-700 backdrop-blur-sm"
          animate={{
            y: [0, 8, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 2.8, repeat: Infinity }}
        >
          <Zap className="h-5 w-5 text-slate-400" />
        </motion.div>

        <motion.div
          className="absolute -bottom-12 -right-12 p-3 bg-gray-800/50 rounded-full border border-gray-700 backdrop-blur-sm"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          <FileText className="h-5 w-5 text-emerald-400" />
        </motion.div>

        <motion.div
          className="absolute -top-12 -left-12 p-3 bg-gray-800/50 rounded-full border border-gray-700 backdrop-blur-sm"
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Scan className="h-5 w-5 text-slate-400" />
        </motion.div>

        {/* Pulsing data points */}
        <div className="absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-slate-400 rounded-full"
              style={{
                left: `${20 + (i * 12)}%`,
                top: `${30 + Math.sin(i) * 20}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.3,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-8 left-0 right-0 text-center space-y-3">
        <div className="flex justify-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-slate-400 rounded-full"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{
                duration: 0.8,
                delay: i * 0.2,
                repeat: Infinity
              }}
            />
          ))}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-300">Analyzing resume against job requirements</p>
          <p className="text-xs text-slate-500">This may take a few moments...</p>
        </div>
      </div>
    </div>
  );
}