import React, { useState } from 'react'
import { motion } from 'framer-motion'
import useMeasure from 'react-use-measure'
import { cn } from '@/lib/utils'

export function InfiniteSlider({
  children,
  duration = 25,
  durationOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: {
  children: React.ReactNode
  duration?: number
  durationOnHover?: number
  direction?: 'horizontal' | 'vertical'
  reverse?: boolean
  className?: string
}) {
  const [ref, { width, height }] = useMeasure()
  const [isHovered, setIsHovered] = useState(false)
  const size = direction === 'horizontal' ? width : height
  const currentDuration = isHovered && durationOnHover !== undefined ? durationOnHover : duration

  const animateProp =
    direction === 'horizontal'
      ? { x: reverse ? [0, size] : [0, -size] }
      : { y: reverse ? [0, size] : [0, -size] }

  return (
    <div
      className={cn('overflow-hidden', className)}
      onMouseEnter={() => durationOnHover !== undefined && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={cn('flex w-max', direction === 'vertical' && 'flex-col')}
        animate={animateProp}
        transition={{ duration: currentDuration, ease: 'linear', repeat: Infinity }}
        key={currentDuration}
      >
        <div ref={ref} className={cn('flex', direction === 'vertical' && 'flex-col')}>
          {children}
        </div>
        <div className={cn('flex', direction === 'vertical' && 'flex-col')} aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  )
}
