import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Menu, X, Globe, Map, User, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback, getInitials } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { t, i18n } = useTranslation('common')
  const { user, guide, isAuthenticated, isLoading, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en'
    i18n.changeLanguage(newLang)
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLang
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/guides', label: t('nav.guides') },
    { href: '/about', label: t('nav.about') },
    { href: '/pricing', label: t('nav.pricing') },
    { href: '/contact', label: t('nav.contact') },
  ]

  const handleSignOut = async () => {
    await signOut()
    setIsUserMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="container">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Map className="h-7 w-7 text-secondary" />
            <span className="hidden sm:inline">Tour Guides Israel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                activeProps={{ className: 'text-primary' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{i18n.language === 'en' ? 'עב' : 'EN'}</span>
            </button>

            {/* Auth Section */}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Avatar size="sm">
                        {guide?.photo_url ? (
                          <AvatarImage src={guide.photo_url} alt={guide.full_name} />
                        ) : null}
                        <AvatarFallback>
                          {guide ? getInitials(guide.full_name) : user?.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                        {guide?.full_name || user?.email?.split('@')[0]}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {guide?.full_name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>

                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>

                        {guide && (
                          <Link
                            to={`/guides/${guide.id}`}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            View My Profile
                          </Link>
                        )}

                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/login">{t('nav.login')}</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to="/for-guides/register">Join as Guide</Link>
                    </Button>
                  </div>
                )}
              </>
            )}

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
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2 px-4 pt-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>{t('nav.login')}</Link>
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link to="/for-guides/register" onClick={() => setIsOpen(false)}>Join</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

