import React, { Children } from 'react';
import { motion } from 'framer-motion';
interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}
export function StaggeredList({
  children,
  className = '',
  staggerDelay = 0.1
}: StaggeredListProps) {
  return <div className={className}>
      {Children.map(children, (child, index) => <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: index * staggerDelay,
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }}>
          {child}
        </motion.div>)}
    </div>;
}