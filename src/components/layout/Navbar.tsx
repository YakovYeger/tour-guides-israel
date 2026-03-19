import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Menu, X, Globe, Map } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { t, i18n } = useTranslation('common')
  const [isOpen, setIsOpen] = useState(false)

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en'
    i18n.changeLanguage(newLang)
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLang
  }

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/guides', label: t('nav.guides') },
    { href: '/about', label: t('nav.about') },
    { href: '/pricing', label: t('nav.pricing') },
    { href: '/contact', label: t('nav.contact') },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-header-bg backdrop-blur-md">
      <div className="page-wrap">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-desert-ink">
            <Map className="h-7 w-7 text-sunset" />
            <span className="hidden sm:inline">Tour Guides Israel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="nav-link text-sm font-medium"
                activeProps={{ className: 'is-active' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-desert-ink-soft hover:bg-link-bg-hover transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{i18n.language === 'en' ? 'עב' : 'EN'}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">{t('nav.signup')}</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-line py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-4 py-2 text-sm font-medium text-desert-ink-soft hover:bg-link-bg-hover rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 px-4 pt-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link to="/signup">{t('nav.signup')}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

