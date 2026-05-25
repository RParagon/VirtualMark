import React, { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

export const ContainerScroll = ({
  titleComponent,
  children,
  className,
}: {
  titleComponent: string | React.ReactNode
  children: React.ReactNode
  className?: string
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const scaleDimensions = () => (isMobile ? [0.82, 0.97] : [1.35, 1])

  const rotate = useTransform(scrollYProgress, [0, 0.7], [28, 0])
  const scale = useTransform(scrollYProgress, [0, 0.7], scaleDimensions())
  const translate = useTransform(scrollYProgress, [0, 0.7], [0, -80])

  return (
    <div
      className={cn(
        'h-[58rem] md:h-[74rem] flex items-center justify-center relative p-2 md:p-20',
        className
      )}
      ref={containerRef}
    >
      <div className="py-12 md:py-44 w-full relative" style={{ perspective: '1200px' }}>
        <ScrollHeader translate={translate} titleComponent={titleComponent} />
        <ScrollCard rotate={rotate} scale={scale}>
          {children}
        </ScrollCard>
      </div>
    </div>
  )
}

function ScrollHeader({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>
  titleComponent: string | React.ReactNode
}) {
  return (
    <motion.div style={{ translateY: translate }} className="max-w-5xl mx-auto text-center">
      {titleComponent}
    </motion.div>
  )
}

function ScrollCard({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>
  scale: MotionValue<number>
  children: React.ReactNode
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          '0 0 0 1px rgba(239,68,68,0.08), 0 9px 20px rgba(0,0,0,0.55), 0 37px 37px rgba(0,0,0,0.48), 0 84px 50px rgba(0,0,0,0.30), 0 149px 60px rgba(0,0,0,0.12), 0 233px 65px rgba(0,0,0,0.04)',
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[42rem] w-full border-2 border-[#2e2e2e] p-1 bg-[#151515] rounded-[30px]"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-[#111]">
        {children}
      </div>
    </motion.div>
  )
}
