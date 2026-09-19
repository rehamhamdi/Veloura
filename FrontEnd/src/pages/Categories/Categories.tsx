import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// داتا الأقسام (زودناها لـ 8 أقسام بدل 4)
const categoriesData = [
  {
    id: 1,
    name: 'Cleanse',
    description: 'Start your routine with gentle cleansers.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=85',
    itemCount: 4,
  },
  {
    id: 2,
    name: 'Hydrate',
    description: 'Quench skin’s thirst with nourishing serums.',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=85',
    itemCount: 6,
  },
  {
    id: 3,
    name: 'Protect',
    description: 'Shield skin from environmental stressors.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9b9f8?auto=format&fit=crop&w=600&q=85',
    itemCount: 3,
  },
  {
    id: 4,
    name: 'Glow',
    description: 'Enhance your natural beauty and radiance.',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=85',
    itemCount: 5,
  },
  {
    id: 5,
    name: 'Treat',
    description: 'Potent formulas for specific skin concerns.',
    image: 'https://images.unsplash.com/photo-1615397323190-25e2e850b555?auto=format&fit=crop&w=600&q=85',
    itemCount: 7,
  },
  {
    id: 6,
    name: 'Masks',
    description: 'Deep cleansing and hydrating weekly rituals.',
    image: 'https://images.unsplash.com/photo-1629198725876-8051878b27dd?auto=format&fit=crop&w=600&q=85',
    itemCount: 4,
  },
  {
    id: 7,
    name: 'Body Care',
    description: 'Luxurious hydration for your entire body.',
    image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=600&q=85',
    itemCount: 8,
  },
  {
    id: 8,
    name: 'Tools',
    description: 'Facial rollers and sculpting massage tools.',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=85',
    itemCount: 3,
  }
];

export default function Categories() {
  return (
    <main className="min-h-screen bg-[#f8f3ed] px-6 py-12 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1320px]">
        
        {/* عنوان الصفحة */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[.2em] text-[#a86f6b]">
            Explore by Need
          </p>
          <h1 className="font-['Playfair_Display'] text-4xl text-[#422f2c] sm:text-5xl">
            Shop by Category
          </h1>
        </div>

        {/* شبكة الأقسام بعد التعديل (4 أعمدة) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categoriesData.map((category) => (
            <Link 
              to="/products" 
              key={category.id}
              // صغرنا الارتفاع هنا لـ 320 بيكسل
              className="group relative flex h-[280px] w-full flex-col justify-end overflow-hidden rounded-[20px] bg-[#e9d2c5] p-6 text-white sm:h-[320px]"
            >
              <img 
                src={category.image} 
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#3b2a29]/90 via-[#3b2a29]/30 to-transparent transition-opacity duration-500 group-hover:opacity-95" />

              <div className="relative z-10 translate-y-6 transition-transform duration-500 group-hover:translate-y-0">
                <span className="mb-2 inline-block rounded-full bg-[#fffaf5]/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md">
                  {category.itemCount} Products
                </span>
                
                {/* صغرنا حجم الخط هنا لـ 2xl */}
                <h2 className="mb-2 font-['Playfair_Display'] text-2xl font-medium sm:text-3xl">
                  {category.name}
                </h2>
                
                {/* صغرنا الوصف وخليناه سطرين بس */}
                <p className="mb-5 max-w-[95%] text-xs text-[#f8e9e1] opacity-0 transition-opacity duration-500 group-hover:opacity-100 line-clamp-2">
                  {category.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs font-bold text-[#f3d9d0]">
                  Explore <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}