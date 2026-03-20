import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

export const PageTransition = ({ children }: PropsWithChildren) => (
  <motion.div
    initial={{ opacity: 0, y: 18, scale: 0.985 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.99 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="min-h-full"
  >
    {children}
  </motion.div>
);
