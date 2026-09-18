import { useEffect, useState } from 'react';
import { ShoppingBag, ChevronDown, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart, addToWishlist, removeFromWishlist } from '../../features/cart/cartSlice';
import api from '../../services/api';
import '../../index.css'; 

// شكل الداتا الحقيقية اللي راجعة من الباك إند
interface Product {
  id: number;
  title: string; 
  price: number;
  description: string;
  category: string;
  images?: { id: number; url: string }[];
}

export default function Product() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.cart?.wishlistItems || []);

  // 1. جلب الداتا من الباك إند أول ما الصفحة تفتح
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('Product');
        
        // السطر ده هيطبع شكل الداتا في الكونسول عشان نشوفها
        console.log("Backend Response:", response.data);
        
        // كود ذكي بيحاول يقرأ الداتا بكذا شكل محتمل من ASP.NET
        if (Array.isArray(response.data)) {
          setProducts(response.data); // لو راجعة مباشرة
        } else if (response.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data); // لو متغلفة في data
        } else if (response.data && Array.isArray(response.data.$values)) {
          setProducts(response.data.$values); // لو الباك إند مفعل الـ Preserve References
        } else {
          console.warn("Couldn't find the products array in the response");
        }

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 2. الفلترة بتتم على الداتا الحقيقية (products) بدل الداتا الوهمية
  const filteredProducts = filter === 'All' ? products : products.filter(p => p.category === filter);
  
  // 3. الترقيم
  const itemsPerPage = 8; // عرض 8 منتجات في الصفحة
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // صورة افتراضية لو الباك إند مرجعش صور للمنتج
  const defaultImage = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f3ed]">
        <div className="text-2xl font-['Playfair_Display'] text-[#79504b] animate-pulse">
          Loading Collection...
        </div>
      </div>
    );
  }

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
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-[#d8bbb0] bg-transparent px-5 py-2.5 text-sm font-medium text-[#76504c] outline-none transition hover:border-[#a86f6b] focus:border-[#a86f6b]"
              >
                {filter === 'All' ? 'All Products' : filter}
                <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <ul className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-[16px] border border-[#eadcd2] bg-[#fffdf9] p-2 shadow-[0_8px_24px_rgba(83,55,48,.12)]">
                  {/* الفئات بناءً على الداتا اللي راجعة */}
                  {['All', 'Cleansers', 'Serums', 'Moisturizers', 'Sunscreen', 'Exfoliators', 'Eye Care', 'Lip Care'].map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => {
                          setFilter(cat);
                          setIsDropdownOpen(false);
                          setCurrentPage(1); 
                        }}
                        className={`w-full rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${
                          filter === cat
                            ? 'bg-[#f1e3dc] font-bold text-[#422f2c]'
                            : 'text-[#735d58] hover:bg-[#faf6f0] hover:text-[#422f2c]'
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

        {/* شبكة المنتجات الحقيقية */}
        {displayedProducts.length === 0 ? (
           <div className="text-center py-20 text-lg text-[#735d58]">
             No products found in this category.
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {displayedProducts.map((product) => {
              const isWishlisted = wishlistItems.some((item) => item.id === product.id);

              return (
                <article key={product.id} className="group cursor-pointer flex flex-col">
                  <div className="relative h-[320px] mb-4 overflow-hidden rounded-[20px] bg-[#e9d2c5]">
                    <img 
                    src={product.images && product.images.length > 0 ? product.images[0].url : defaultImage} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* الإضافة للسلة */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      <button 
                        className="w-full flex items-center justify-center gap-2 bg-[#fffaf5]/90 backdrop-blur-sm text-[#422f2c] font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-[#422f2c] hover:text-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(addToCart({
                            id: product.id,
                            name: product.title, 
                            price: product.price
                          }))
                        }}
                      >
                        <ShoppingBag size={16} />
                        Add to Cart
                      </button>
                    </div>

                    {/* الإضافة للمفضلة */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isWishlisted) {
                          dispatch(removeFromWishlist(product.id));
                        } else {
                          dispatch(addToWishlist({
                            id: product.id,
                            name: product.title,
                            price: product.price
                          }));
                        }
                      }}
                      className={`absolute top-3 right-3 z-10 rounded-full p-2 transition ${
                        isWishlisted 
                          ? 'bg-red-50 text-red-500' 
                          : 'bg-white/80 text-[#a86f6b] hover:bg-[#f1e3dc]'
                      }`}
                    >
                      <Heart size={22} className={isWishlisted ? 'fill-current' : ''} />
                    </button>
                  </div>
                  
                  <div className="flex flex-col flex-grow">
                    <p className="text-[10px] uppercase tracking-[.15em] text-[#a86f6b] mb-1">{product.category}</p>
                    <h3 className="font-['Playfair_Display'] text-lg text-[#493331] mb-1">{product.title}</h3>
                    <p className="font-medium text-[#76504c] mt-auto">${product.price.toFixed(2)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* الترقيم (Pagination) */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-2">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8bbb0] text-[#76504c] transition-colors hover:bg-[#f1e3dc] disabled:opacity-50 disabled:hover:bg-transparent"
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>

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