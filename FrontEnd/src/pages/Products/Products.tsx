import { useState } from 'react';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; 
import '../../index.css'; 

// داتا وهمية للمنتجات لحد ما نربط بالـ API
const allProducts = [
  { id: 1, name: 'Purifying Cleanser', price: 28, category: 'Cleanse', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85' },
  { id: 2, name: 'Deep Hydration Serum', price: 45, category: 'Hydrate', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=85' },
  { id: 3, name: 'Daily Sun Shield SPF 30', price: 32, category: 'Protect', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9b9f8?auto=format&fit=crop&w=700&q=85' },
  { id: 4, name: 'Night Repair Cream', price: 55, category: 'Nourish', image: 'https://images.unsplash.com/photo-1615397323190-25e2e850b555?auto=format&fit=crop&w=700&q=85' },
  { id: 5, name: 'Gentle Exfoliator', price: 24, category: 'Exfoliate', image: 'https://images.unsplash.com/photo-1629198725876-8051878b27dd?auto=format&fit=crop&w=700&q=85' },
  { id: 6, name: 'Radiance Face Oil', price: 48, category: 'Glow', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85' },
  { id: 7, name: 'Balancing Toner', price: 22, category: 'Cleanse', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=700&q=85' },
  { id: 8, name: 'Vitamin C Boost', price: 38, category: 'Glow', image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=700&q=85' },
  { id: 9, name: 'Purifying Cleanser', price: 28, category: 'Cleanse', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85' },
  { id: 10, name: 'Deep Hydration Serum', price: 45, category: 'Hydrate', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=85' },
  { id: 11, name: 'Daily Sun Shield SPF 30', price: 32, category: 'Protect', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9b9f8?auto=format&fit=crop&w=700&q=85' },
  { id: 12, name: 'Night Repair Cream', price: 55, category: 'Nourish', image: 'https://images.unsplash.com/photo-1615397323190-25e2e850b555?auto=format&fit=crop&w=700&q=85' },
  { id: 13, name: 'Gentle Exfoliator', price: 24, category: 'Exfoliate', image: 'https://images.unsplash.com/photo-1629198725876-8051878b27dd?auto=format&fit=crop&w=700&q=85' },
  { id: 14, name: 'Radiance Face Oil', price: 48, category: 'Glow', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85' },
  { id: 15, name: 'Balancing Toner', price: 22, category: 'Cleanse', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=700&q=85' },
  { id: 16, name: 'Vitamin C Boost', price: 38, category: 'Glow', image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=700&q=85' },
];

export default function Product() {
  const [filter, setFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // فلترة المنتجات بناءً على الاختيار
  const filteredProducts = filter === 'All' ? allProducts : allProducts.filter(p => p.category === filter);
  // 1. هنحدد عايزين كام منتج في الصفحة الواحدة (مثلاً 8)
  const itemsPerPage = 5;

  // 2. نحسب عدد الصفحات الكلي بناءً على عدد المنتجات
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // 3. نقص المنتجات عشان ناخد الجزء الخاص بالصفحة اللي إحنا واقفين فيها بس
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <main className="bg-[#f8f3ed] min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1320px]">
        {/* الهيدر والفلتر */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#422f2c] mb-3">Our Collection</h1>
            <p className="text-[#806967] text-sm max-w-md">Thoughtfully formulated skincare essentials for your daily ritual.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* القايمة المخصصة (Custom Dropdown) */}
            <div className="relative">
              
              {/* الزرار اللي بيفتح ويقفل القايمة */}
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-[#d8bbb0] bg-transparent px-5 py-2.5 text-sm font-medium text-[#76504c] outline-none transition hover:border-[#a86f6b] focus:border-[#a86f6b]"
              >
                {filter === 'All' ? 'All Products' : filter}
                <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* القايمة نفسها اللي بتنزل (بتظهر بس لو isDropdownOpen = true) */}
              {isDropdownOpen && (
                <ul className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-[16px] border border-[#eadcd2] bg-[#fffdf9] p-2 shadow-[0_8px_24px_rgba(83,55,48,.12)]">
                  {['All', 'Cleanse', 'Hydrate', 'Protect', 'Glow'].map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => {
                          setFilter(cat);
                          setIsDropdownOpen(false); // نقفل القايمة بعد الاختيار
                        }}
                        className={`w-full rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${
                          filter === cat
                            ? 'bg-[#f1e3dc] font-bold text-[#422f2c]' // لون العنصر النشط
                            : 'text-[#735d58] hover:bg-[#faf6f0] hover:text-[#422f2c]' // لون العناصر العادية
                        }`}
                      >
                        {cat === 'All' ? 'All Products' : cat}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              
            </div>
          </div>
        </div>

        {/* شبكة المنتجات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {displayedProducts.map((product) => (
            <article key={product.id} className="group cursor-pointer flex flex-col">
              {/* صورة المنتج */}
              <div className="relative h-[320px] mb-4 overflow-hidden rounded-[20px] bg-[#e9d2c5]">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* زرار الإضافة للسلة بيظهر لما نعمل Hover */}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <button 
                    className="w-full flex items-center justify-center gap-2 bg-[#fffaf5]/90 backdrop-blur-sm text-[#422f2c] font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-[#422f2c] hover:text-white transition-colors"
                    onClick={() => alert(`Added ${product.name} to cart!`)}
                  >
                    <ShoppingBag size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
              
              {/* تفاصيل المنتج */}
              <div className="flex flex-col flex-grow">
                <p className="text-[10px] uppercase tracking-[.15em] text-[#a86f6b] mb-1">{product.category}</p>
                <h3 className="font-['Playfair_Display'] text-lg text-[#493331] mb-1">{product.name}</h3>
                <p className="font-medium text-[#76504c] mt-auto">${product.price}</p>
              </div>
            </article>
          ))}
        </div>
        {totalPages > 1 && ( // السطر ده بيخفي الترقيم لو المنتجات كلها مكفية صفحة واحدة
          <div className="mt-16 flex items-center justify-center gap-2">
            
            {/* زرار السابق */}
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8bbb0] text-[#76504c] transition-colors hover:bg-[#f1e3dc] disabled:opacity-50 disabled:hover:bg-transparent"
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>

            {/* أرقام الصفحات الحقيقية */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-[15px] font-bold transition-all ${
                  currentPage === page
                    ? 'bg-[#422f2c] text-[#fffaf5] shadow-md' 
                    : 'text-[#76504c] hover:bg-[#f1e3dc]'      
                }`}
              >
                {page}
              </button>
            ))}

            {/* زرار التالي */}
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8bbb0] text-[#76504c] transition-colors hover:bg-[#f1e3dc] disabled:opacity-50 disabled:hover:bg-transparent"
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={20} />
            </button>
            
          </div>
        )}
      </div>
    </main>
  );
}