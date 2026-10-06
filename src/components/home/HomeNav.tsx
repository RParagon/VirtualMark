import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ArrowRight, waLink } from './shared'

const links = [
  { label: 'Processo', href: '/#processo' },
  { label: 'Casos', href: '/#casos' },
  { label: 'Criativos', href: '/#criativos' },
  { label: 'Blog', href: '/blog' },
]

const HomeNav = () => {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-5 sm:px-8 transition-[background-color,backdrop-filter,border-color] duration-500 border-b ${
        scrolled || open ? 'bg-background/80 backdrop-blur-xl border-white/10' : 'bg-transparent border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between">
        <Link to="/" aria-label="VirtualMark, página inicial" className="flex items-center">
          <img src="/vm-logo.svg" alt="VirtualMark" className="h-9 w-auto" width={72} height={36} />
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Principal">
          {links.map((l) =>
            l.href.startsWith('/#') ? (
              <a key={l.label} href={l.href} className="text-sm text-white/70 transition-colors hover:text-white">
                {l.label}
              </a>
            ) : (
              <Link key={l.label} to={l.href} className="text-sm text-white/70 transition-colors hover:text-white">
                {l.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden md:block">
          <a
            href="/#caminhos"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-primary-500 hover:text-white"
          >
            Pedir consultoria
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <button
          className="text-white/80 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="-mx-5 border-t border-white/10 bg-background/95 px-5 pb-6 pt-4 sm:-mx-8 sm:px-8 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="py-3 font-display text-2xl font-bold text-white">
                {l.label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href="/#caminhos"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3.5 font-semibold text-white"
            >
              Pedir consultoria <ArrowRight />
            </a>
            <a
              href={waLink('Oi! Vim pelo site da VirtualMark e quero conversar.')}
              className="py-2 text-center text-sm text-white/70 underline underline-offset-4"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default HomeNav
