import { ArrowRight } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'

function AboutSection() {
  const { t } = useI18n()
  return (
    <section id="about" className="mx-auto grid max-w-[1160px] items-center gap-10 px-6 py-20 lg:grid-cols-[.8fr_1fr] lg:px-10 lg:py-28">
      <div className="relative h-[380px] overflow-hidden rounded-[28px] bg-[#d9b8ad]"><img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=85" alt="A calm skincare ritual with botanical ingredients" /></div>
      <div className="max-w-[500px]"><p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#a86f6b]">{t('home.aboutEyebrow')}</p><h2 className="mt-4 font-['Playfair_Display'] text-4xl leading-tight text-[#422f2c] sm:text-5xl">{t('home.aboutTitle')}</h2><p className="mt-6 text-[15px] leading-[1.85] text-[#806967]">{t('home.aboutText')}</p><a className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#76504c]" href="#footer">{t('home.discover')} <ArrowRight size={16} /></a></div>
    </section>
  )
}

export default AboutSection
