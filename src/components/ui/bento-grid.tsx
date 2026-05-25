import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export interface BentoItem {
  title: string
  description: string
  icon: ReactNode
  status?: string
  tags?: string[]
  meta?: string
  cta?: string
  colSpan?: number
  hasPersistentHover?: boolean
}

interface BentoGridProps {
  items: BentoItem[]
  className?: string
}

function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-3', className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            'group relative p-5 rounded-2xl overflow-hidden transition-all duration-300',
            'border border-gray-800 bg-gray-900/60 backdrop-blur-sm',
            'hover:shadow-[0_4px_24px_rgba(239,68,68,0.08)]',
            'hover:-translate-y-0.5 hover:border-primary-500/30 will-change-transform',
            item.colSpan === 2 ? 'md:col-span-2' : 'col-span-1',
            item.hasPersistentHover && 'shadow-[0_4px_24px_rgba(239,68,68,0.06)] border-primary-500/20 -translate-y-0.5'
          )}
        >
          {/* Dot pattern on hover */}
          <div
            className={cn(
              'absolute inset-0 transition-opacity duration-300',
              item.hasPersistentHover ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.04)_1px,transparent_1px)] bg-[length:4px_4px]" />
          </div>

          <div className="relative flex flex-col space-y-3">
            {/* Icon + status */}
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary-500/10 group-hover:bg-primary-500/15 transition-all duration-300">
                {item.icon}
              </div>
              {item.status && (
                <span className="text-xs font-medium px-2 py-1 rounded-lg bg-gray-800/80 text-gray-400 transition-colors duration-300 group-hover:bg-gray-800 group-hover:text-gray-300">
                  {item.status}
                </span>
              )}
            </div>

            {/* Title + description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-100 tracking-tight text-[15px]">
                {item.title}
                {item.meta && (
                  <span className="ml-2 text-xs text-gray-500 font-normal">{item.meta}</span>
                )}
              </h3>
              <p className="text-sm text-gray-400 leading-snug">{item.description}</p>
            </div>

            {/* Tags + CTA */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800/60">
              <div className="flex flex-wrap items-center gap-1.5">
                {item.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-md bg-gray-800/80 text-gray-500 hover:bg-gray-800 hover:text-gray-400 transition-all duration-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              {item.cta && (
                <span className="text-xs text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ml-2">
                  {item.cta}
                </span>
              )}
            </div>
          </div>

          {/* Border gradient on hover */}
          <div
            className={cn(
              'absolute inset-0 -z-10 rounded-2xl p-px bg-gradient-to-br from-transparent via-primary-500/10 to-transparent transition-opacity duration-300',
              item.hasPersistentHover ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            )}
          />
        </div>
      ))}
    </div>
  )
}

export { BentoGrid }
