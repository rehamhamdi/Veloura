import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import ar from '../locales/ar'
import en from '../locales/en'
import type { Language, TranslationKey } from '../types/i18n'

type I18nContextValue = { language: Language; direction: 'rtl' | 'ltr'; t: (key: TranslationKey) => string; toggleLanguage: () => void }
const I18nContext = createContext<I18nContextValue | null>(null)

function getInitialLanguage(): Language {
  return localStorage.getItem('veloura-language') === 'ar' ? 'ar' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)
  const direction: 'rtl' | 'ltr' = language === 'ar' ? 'rtl' : 'ltr'
  const translations = language === 'ar' ? ar : en

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = direction
    localStorage.setItem('veloura-language', language)
  }, [direction, language])

  const value = useMemo(() => ({ language, direction, t: (key: TranslationKey) => translations[key], toggleLanguage: () => setLanguage((current) => current === 'en' ? 'ar' : 'en') }), [direction, language, translations])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used inside I18nProvider')
  return context
}