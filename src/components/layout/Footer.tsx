import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Map, Instagram, Facebook, Linkedin, Mail } from 'lucide-react'

export function Footer() {
  const { t } = useTranslation('common')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <Map className="h-7 w-7 text-secondary" />
              <span>Tour Guides Israel</span>
            </Link>
            <p className="text-sm text-gray-400">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" className="text-gray-400 hover:text-secondary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" className="text-gray-400 hover:text-secondary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-secondary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:info@tourguidesisrael.com" className="text-gray-400 hover:text-secondary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link to="/guides" className="text-sm text-gray-400 hover:text-white transition-colors">{t('nav.guides')}</Link></li>
              <li><Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">{t('nav.pricing')}</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* For Guides */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.forGuides')}</h3>
            <ul className="space-y-2">
              <li><Link to="/for-guides" className="text-sm text-gray-400 hover:text-white transition-colors">{t('footer.becomeGuide')}</Link></li>
              <li><Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">{t('footer.guideLogin')}</Link></li>
              <li><Link to="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">{t('nav.pricing')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">{t('footer.contact')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            {t('footer.copyright', { year })}
          </p>
        </div>
      </div>
    </footer>
  )
}

