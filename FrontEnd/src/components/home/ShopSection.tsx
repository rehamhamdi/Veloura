import { ArrowRight } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'

const rituals = [
  { title: 'Cleanse gently', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85' },
  { title: 'Hydrate deeply', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=85' },
  { title: 'Protect daily', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9b9f8?auto=format&fit=crop&w=700&q=85' },
]

function ShopSection() {
  const { t } = useI18n()
  const ritualTitles = [t('home.cleanse'), t('home.hydrate'), t('home.protect')]
  return (
    <section id="shop" className="border-y border-[#eadcd2] bg-[#f2e6de] px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto flex max-w-[1160px] flex-col justify-between gap-7 sm:flex-row sm:items-end"><div><p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#a86f6b]">{t('home.shopEyebrow')}</p><h2 className="mt-3 font-['Playfair_Display'] text-4xl text-[#422f2c] sm:text-5xl">{t('home.shopTitle')}</h2></div><a className="inline-flex items-center gap-2 text-sm font-bold text-[#76504c]" href="#categories">{t('home.viewProducts')} <ArrowRight size={16} /></a></div>
      <div id="categories" className="mx-auto mt-10 grid max-w-[1160px] gap-5 sm:grid-cols-3">
        {rituals.map((ritual, index) => <article className="group overflow-hidden rounded-[24px] bg-[#faf6f0]" key={ritual.title}><div className="h-56 overflow-hidden bg-[#dfc7bb]"><img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={ritual.image} alt="" /></div><div className="p-5"><p className="text-[10px] uppercase tracking-[.16em] text-[#a86f6b]">01 / 0{index + 1}</p><h3 className="mt-2 font-['Playfair_Display'] text-2xl text-[#493331]">{ritualTitles[index]}</h3></div></article>)}
      </div>
    </section>
  )
}

export default ShopSection
