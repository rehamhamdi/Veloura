import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom';
function HeroSection() {
  return (
    <section id="home" className="mx-auto grid max-w-[1320px] items-center gap-12 px-6 pb-20 pt-10 sm:pt-16 lg:grid-cols-[.88fr_1.12fr] lg:gap-16 lg:px-10 lg:pb-28 lg:pt-20">
      <div className="max-w-[540px]">
        <p className="mb-5 text-[11px] font-bold uppercase tracking-[.22em] text-[#a86f6b]">Thoughtful care, beautifully chosen</p>
        <h1 className="max-w-[580px] font-['Playfair_Display'] text-[clamp(3.2rem,6vw,6.3rem)] leading-[.98] text-[#422f2c]">Your Skin,<br /><span className="text-[#ad7770]">Your Ritual.</span></h1>
        <p className="mt-7 max-w-[430px] text-[16px] leading-[1.8] text-[#806967]">Discover carefully selected skincare essentials for a healthier, more radiant-looking you.</p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
    <Link 
    className="inline-flex h-12 items-center gap-3 rounded-full bg-[#6d4946] px-7 text-[13px] font-bold text-[#fffaf5] shadow-[0_10px_24px_rgba(109,73,70,.16)] transition hover:-translate-y-0.5 hover:bg-[#583a38]" 
    to="/products">Shop Now <ArrowRight size={16} />
    </Link>

    <Link 
    className="inline-flex h-12 items-center rounded-full border border-[#d8bbb0] px-7 text-[13px] font-semibold text-[#76504c] transition hover:bg-[#f1e3dc]" 
    to="/products">Explore Collection
  </Link>        
  </div>
        <div className="mt-14 flex items-center gap-8 border-t border-[#e8d9d0] pt-5 text-[11px] uppercase tracking-[.12em] text-[#967a73]"><span>Curated formulas</span><span>Mindful rituals</span></div>
      </div>

      <div className="relative min-h-[430px] overflow-hidden rounded-[38%_38%_18%_18%] bg-[#e9d2c5] shadow-[0_24px_60px_rgba(103,67,58,.14)] sm:min-h-[560px] lg:min-h-[650px]">
        <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1200&q=90" alt="Veloura skincare products on a warm neutral surface" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(90,54,47,.02),rgba(90,54,47,.2))]" />
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between rounded-2xl border border-white/40 bg-[#fffaf5]/75 p-4 backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-8"><div><p className="text-[10px] uppercase tracking-[.17em] text-[#a86f6b]">The edit</p><p className="mt-1 font-['Playfair_Display'] text-xl text-[#493331]">Everyday radiance</p></div><span className="grid h-10 w-10 place-items-center rounded-full bg-[#76504c] text-white"><ArrowRight size={17} /></span></div>
      </div>
    </section>
  )
}

export default HeroSection
