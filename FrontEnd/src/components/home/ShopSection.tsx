import { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const rituals = [
  { title: 'Cleanse gently', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85' },
  { title: 'Hydrate deeply', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=85' },
  { title: 'Protect daily', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9b9f8?auto=format&fit=crop&w=700&q=85' },
  { title: 'Nourish nightly', image: 'https://images.unsplash.com/photo-1615397323190-25e2e850b555?auto=format&fit=crop&w=700&q=85' },
  { title: 'Exfoliate weekly', image: 'https://images.unsplash.com/photo-1629198725876-8051878b27dd?auto=format&fit=crop&w=700&q=85' },
  { title: 'Glow naturally', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=85' }
];

export default function ShopSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      // بنخلي السكرول يتحرك بعرض الحاوية بالكامل (عشان يقلب 3 كروت مرة واحدة)
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    
    <section id="shop" className="border-y border-[#eadcd2] bg-[#f2e6de] px-6 py-16 lg:px-10 lg:py-20 overflow-hidden">
      <div className="mx-auto flex max-w-[1160px] flex-col justify-between gap-7 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#a86f6b]">Shop the ritual</p>
          <h2 className="mt-3 font-['Playfair_Display'] text-4xl text-[#422f2c] sm:text-5xl">Simple steps to softer skin.</h2>
        </div>
       <Link className="inline-flex items-center gap-2 text-sm font-bold text-[#76504c]" to="/products">
  View all products <ArrowRight size={16} />
      </Link>
      </div>

      <div id="categories" className="relative mx-auto mt-10 max-w-[1160px]">
        <button 
          onClick={() => scroll('left')} 
          className="absolute -left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-[#422f2c] text-white opacity-90 shadow-xl transition hover:bg-[#a86f6b] hover:opacity-100 lg:-left-6"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>

        <div 
          ref={scrollRef} 
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {rituals.map((ritual, index) => (
            <article 
              className="group shrink-0 snap-start overflow-hidden rounded-[24px] bg-[#faf6f0] w-full md:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)]" 
              key={ritual.title + index}
            >
              <div className="h-64 overflow-hidden bg-[#dfc7bb]">
                <img className="h-full w-full object-cover transition duration-700 group-hover:scale-110" src={ritual.image} alt={ritual.title} />
              </div>
              <div className="p-6">
                <p className="text-[10px] uppercase tracking-[.16em] text-[#a86f6b]">01 / 0{index + 1}</p>
                <h3 className="mt-2 font-['Playfair_Display'] text-2xl text-[#493331]">{ritual.title}</h3>
              </div>
            </article>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')} 
          className="absolute -right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-[#422f2c] text-white opacity-90 shadow-xl transition hover:bg-[#a86f6b] hover:opacity-100 lg:-right-6"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
