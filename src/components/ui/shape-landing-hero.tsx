import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ElegantShapeProps {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = 'from-white/[0.06]',
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn('absolute', className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'bg-gradient-to-r to-transparent',
            gradient,
            'backdrop-blur-[2px] border-2 border-white/[0.08]',
            'shadow-[0_8px_32px_0_rgba(239,68,68,0.08)]',
            'after:absolute after:inset-0 after:rounded-full',
            'after:bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.12),transparent_70%)]'
          )}
        />
      </motion.div>
    </motion.div>
  )
}

interface HeroGeometricProps {
  badge?: string
  title1?: string
  title2?: string
  subtitle?: string
  children?: React.ReactNode
}

function HeroGeometric({
  badge = 'Virtual Mark',
  title1 = 'Sua Imobiliária Está',
  title2 = 'Perdendo Clientes Para a Concorrência',
  subtitle,
  children,
}: HeroGeometricProps) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
      },
    }),
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-background">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/[0.05] via-transparent to-red-900/[0.04] blur-3xl pointer-events-none" />

      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-red-500/[0.12]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-red-700/[0.10]"
          className="right-[-5%] md:right-[0%] top-[65%] md:top-[70%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-red-600/[0.09]"
          className="left-[5%] md:left-[10%] bottom-[8%] md:bottom-[12%]"
        />
        <ElegantShape
          delay={0.6}
          width={220}
          height={60}
          rotate={20}
          gradient="from-red-400/[0.08]"
          className="right-[12%] md:right-[18%] top-[8%] md:top-[12%]"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-red-300/[0.07]"
          className="left-[22%] md:left-[28%] top-[4%] md:top-[8%]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Badge row - top spacing */}
        <div className="flex-none pt-28 px-4 flex flex-col items-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary-500 block" />
            <span className="text-sm text-white/60 tracking-wide">{badge}</span>
          </motion.div>
        </div>

        {/* Center content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                  {title1}
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-white/90 to-red-500">
                  {title2}
                </span>
              </h1>
            </motion.div>

            {subtitle && (
              <motion.div
                custom={2}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
              >
                <p className="text-base sm:text-lg text-white/45 mb-8 leading-relaxed font-light tracking-wide max-w-2xl mx-auto">
                  {subtitle}
                </p>
              </motion.div>
            )}

            {children && (
              <motion.div
                custom={3}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
              >
                {children}
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="flex-none h-24" />
      </div>

      {/* Top/bottom fades */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80 pointer-events-none" />
    </div>
  )
}

export { HeroGeometric, ElegantShape }
